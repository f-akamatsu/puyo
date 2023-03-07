import base64
import numpy as np
import cv2
import os
import math
from tensorflow.python.keras.models import load_model


def convert_image_to_field(base64bin, p1, p2, p3, p4):
    """
    画像(base64)をフィールド(文字列)に変換
    @param base64bin: 画像(base64)
    @param p1: 左上の座標
    @param p2: 右上の座標
    @param p3: 右下の座標
    @param p4: 左下の座標
    @return: フィールド(文字列)
    """
    # base64→ndarray
    img = base64_to_ndarray(base64bin)

    # ホモグラフィ変換
    h_img = homography(img, p1, p2, p3, p4, 120, 240)

    # 6*12分割
    img_arr = split_grid(h_img, 6, 12)

    # AIで予測
    field_str = predict(img_arr)

    return field_str


def predict(img_arr):
    """
    画像を元にフィールドを予測
    @param img_arr: 画像
    @return: フィールド予測結果
    """
    # 空の配列作成
    field_arr = ["0"] * 72

    # 作成済モデルの読み込み   // TODO サーバ起動時に読み込んで使いまわしたい
    path = os.path.join(os.getcwd(), "kerasmodel", "puyo_image_classification_model.hdf5")
    model = load_model(path)

    # モデルで予測
    X = img_arr.astype("float32") / 255.0
    predicts = model.predict(X)

    for i, p in enumerate(predicts):
        # 画像は12段目→1段目の順になっているので、1段目→12段目になるようにする
        x = i % 6
        y = 11 - int(i / 6)
        ii = x + y * 6

        color = p.argmax()
        if color == 6: color = 9  # おじゃまは6で返ってくるので9に変更
        field_arr[ii] = str(color)

    return "".join(field_arr)


def homography(img, p1, p2, p3, p4, width, height):
    """
    ホモグラフィ変換
    @param img: 画像
    @param p1: 左上の座標
    @param p2: 右上の座標
    @param p3: 右下の座標
    @param p4: 右上の座標
    @param width: 変換後の幅
    @param height: 変換後の高さ
    @return: 変換後の画像
    """
    src = np.float32([p1, p2, p3, p4])
    dst = np.float32([[0, 0], [width, 0], [width, height], [0, height]])

    M = cv2.getPerspectiveTransform(src, dst)
    output = cv2.warpPerspective(img, M, (width, height))

    return output


def base64_to_ndarray(base64bin):
    """
    画像のbase64をndarrayに変換
    @param base64bin: base64
    @return: ndarray
    """
    img_data = base64.b64decode(base64bin)
    img_np = np.fromstring(img_data, np.uint8)
    src = cv2.imdecode(img_np, cv2.IMREAD_ANYCOLOR)
    return src


def split_grid(arr, x, y):
    """
    ndarray配列を格子状に分割する
    @param arr: 分割したい配列
    @param x: 横方向の分割数
    @param y: 縦方向の分割数
    @return: 分割後の配列
    """
    return np.concatenate(np.hsplit(np.stack(np.hsplit(arr, x)), y))


def angle(pt1, pt2, pt0):
    dx1 = float(pt1[0, 0] - pt0[0, 0])
    dy1 = float(pt1[0, 1] - pt0[0, 1])
    dx2 = float(pt2[0, 0] - pt0[0, 0])
    dy2 = float(pt2[0, 1] - pt0[0, 1])
    v = math.sqrt((dx1 * dx1 + dy1 * dy1) * (dx2 * dx2 + dy2 * dy2))
    return (dx1 * dx2 + dy1 * dy2) / v


def find_contours(img):
    """
    輪郭を取得する。
    @param img: 画像
    @return: 輪郭
    """
    contours, hierarchy = cv2.findContours(img, cv2.RETR_TREE, cv2.CHAIN_APPROX_SIMPLE)
    return contours


def extract_rect_contours(contours, img_size):
    """
    矩形の輪郭のみを抽出する。
    @param contours: 輪郭
    @param img_size: 輪郭を取得した画像のサイズ
    @return: 矩形のみ抽出した輪郭
    """
    rect_contours = []
    for i, cnt in enumerate(contours):
        arclen = cv2.arcLength(cnt, True)
        approx = cv2.approxPolyDP(cnt, arclen * 0.1, True)
        area = abs(cv2.contourArea(approx))
        if approx.shape[0] == 4 and img_size * 0.1 < area < img_size * 0.9 and cv2.isContourConvex(approx):
            maxCosine = 0
            for j in range(2, 5):
                cosine = abs(angle(approx[j % 4], approx[j - 2], approx[j - 1]))
                maxCosine = max(maxCosine, cosine)
            if maxCosine < 0.2:
                rect_contours.append(approx)
    return rect_contours


def find_rect_contours(img):
    """
    矩形の輪郭を取得する。
    @param img: 画像
    @return: 矩形の輪郭
    """
    shape = img.shape
    img_size = shape[0] * shape[1];
    contours = find_contours(img)
    rect_contours = extract_rect_contours(contours, img_size)
    return rect_contours


def extract_field_contours(base64bin):
    """
    ぷよぷよの画像からフィールドの矩形の枠を取得する。
    （グレースケール　→　二値化（適応的しきい値処理）　→　矩形抽出）
    @param base64bin: 画像(base64)
    @return: フィールドの枠
    """
    # base64→ndarray
    img = base64_to_ndarray(base64bin)

    # blockSizeは画像の半分で設定
    shape = img.shape
    block_size = int(shape[0] / 2) if shape[0] > shape[1] else int(shape[1] / 2)

    if block_size % 2 == 0: block_size += 1

    C = 20

    # グレースケール化
    img_gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

    # 二値化（適応的閾値処理）
    img_thresh = cv2.adaptiveThreshold(img_gray, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C, cv2.THRESH_BINARY, block_size, C)

    # 矩形の輪郭抽出
    rect_cnt = find_rect_contours(img_thresh)

    return rect_cnt
