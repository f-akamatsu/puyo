from flask import Flask, render_template, redirect, url_for, request, jsonify
from lib.puyoimage import convert_image_to_field, extract_field_contours
from lib.nazopuyo import solve

app = Flask(__name__)


@app.route("/")
def index():
    return redirect(url_for("editor"))


# editor
@app.route("/editor")
def editor():
    return render_template("editor.html")


# tokopuyo
@app.route("/tokopuyo")
def tokopuyo():
    return render_template("tokopuyo.html")


# nazotoki
@app.route("/nazotoki")
def nazotoki():
    return render_template("nazotoki.html")


@app.route("/convertimage", methods=["POST"])
def convertimage():
    base64bin = request.json["base64"].split(",")[1]

    corner = request.json["corner"]
    p1 = [corner["topLeft"]["x"], corner["topLeft"]["y"]]
    p2 = [corner["topRight"]["x"], corner["topRight"]["y"]]
    p3 = [corner["bottomRight"]["x"], corner["bottomRight"]["y"]]
    p4 = [corner["bottomLeft"]["x"], corner["bottomLeft"]["y"]]

    field = convert_image_to_field(base64bin, p1, p2, p3, p4)
    res_json = {
        "field": field
    }
    return jsonify(res_json)


@app.route("/fieldcontours", methods=["POST"])
def fieldcontours():
    base64bin = request.json["base64"].split(",")[1]
    field_cnts = extract_field_contours(base64bin)

    # 2次元ndarrayのリスト　→　3次元のリストに変換
    contours = []
    for cnt in field_cnts:
        # (4,1,2)で返ってくるので(4,2)に変換する
        cnt = cnt.reshape(4, 2)
        contours.append(cnt.tolist())

    res_json = {
        "contours": contours
    }
    return jsonify(res_json)


@app.route("/findnazo", methods=["POST"])
def findnazo():
    field_str = request.json["fieldStr"]
    tsumo_str = request.json["tsumoStr"]
    q_type = request.json["qType"]
    q_require = request.json["qRequire"]

    tsumo_str = tsumo_str.replace("0", "")

    answer_list = solve(field_str, tsumo_str, q_type, q_require)

    return jsonify(answer_list)


if __name__ == "__main__":
    app.run()
