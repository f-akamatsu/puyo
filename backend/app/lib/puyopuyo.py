CHILD_POSITION = {
    "TOP": 0
    , "RIGHT": 1
    , "BOTTOM": 0
    , "LEFT": -1
}
X_SIZE = 6
Y_SIZE = 13
_CHAIN_BONUS = [0, 8, 16, 32, 64, 96, 128, 160, 192, 224, 256, 288, 320, 352, 384, 416, 448, 480, 512];
_CONNECT_BONUS = [0, 2, 3, 4, 5, 6, 7, 10];
_COLOR_BONUS = [0, 3, 6, 12, 24];


def field_str_to_array(field_str):
    arr = [["0"] * X_SIZE for i in range(Y_SIZE)]
    for i in range(X_SIZE * Y_SIZE):
        x = i % X_SIZE
        y = int(i / X_SIZE)
        arr[y][x] = field_str[i]
    return arr


def check_droppable(field, a_x, c_pos):
    c_x = a_x + CHILD_POSITION[c_pos]
    a_height = _get_height(field, a_x)
    c_height = _get_height(field, c_x)
    return (a_height < Y_SIZE - 1) and (c_height < Y_SIZE - 1)


def drop_tsumo_to_field(field, a_col, c_col, a_x, c_pos):
    earlier_puyo = {}
    later_puyo = {}
    if c_pos == "BOTTOM":
        earlier_puyo["col"] = c_col
        earlier_puyo["x"] = a_x + CHILD_POSITION[c_pos]
        later_puyo["col"] = a_col
        later_puyo["x"] = a_x
    else:
        earlier_puyo["col"] = a_col
        earlier_puyo["x"] = a_x
        later_puyo["col"] = c_col
        later_puyo["x"] = a_x + CHILD_POSITION[c_pos]

    field = _drop_puyo_to_field(field, earlier_puyo)
    field = _drop_puyo_to_field(field, later_puyo)

    field, chain_info = start(field)

    return field, chain_info


def _drop_puyo_to_field(field, puyo):
    x = puyo["x"]
    y = _get_height(field, x)
    y += 1
    if y < Y_SIZE:
        col = puyo["col"]
        field[y][x] = col
    return field


def _get_height(field, x):
    v_arr = [h_arr[x] for h_arr in field]
    y = Y_SIZE - 1
    while y >= 0:
        if v_arr[y] != "0":
            break
        y -= 1
    return y


def start(field):
    chain = 0
    chain_info = []
    while True:
        chain += 1
        field = _drop(field)

        check, connect_list = _connect_check(field)
        if len(connect_list) == 0:
            break

        field, score, chain, erase, color_num = _chain(field, check, connect_list, chain)
        info = {
            "score": score
            , "chain": chain
            , "erase": erase
            , "color_num": color_num
        }
        chain_info.append(info)
    return field, chain_info


def _drop(field):
    for y in range(Y_SIZE-1):
        for x in range(X_SIZE):
            if field[y][x] != "0":
                continue
            from_y = y
            from_col = None
            while True:
                from_y += 1
                if from_y >= Y_SIZE:
                    break
                from_col = field[from_y][x]
                if from_col != "0":
                    break
            if from_col == "0":
                continue
            field[y][x] = from_col
            field[from_y][x] = "0"
    return field


def _connect_check(field):
    check = [[None] * X_SIZE for i in range(Y_SIZE-1)]
    connect_list = []
    for y in range(Y_SIZE-1):
        for x in range(X_SIZE):
            _connect_check_rec(field, check, connect_list, x, y, -1, -1)
    connect_list = [c for c in connect_list if c[0] >= 4]
    return check, connect_list


def _connect_check_rec(field, check, connect_list, x, y, pre_x, pre_y):
    if check[y][x] is not None:
        return

    col = field[y][x]
    if (col == "0") or (col == "9"):
        check[y][x] = [0]
        return

    con = None
    if (pre_x == -1) and (pre_y == -1):
        con = [1]
        connect_list.append(con)
    else:
        pre_col = field[pre_y][pre_x]
        if col != pre_col:
            return
        con = check[pre_y][pre_x]
        con[0] += 1

    check[y][x] = con

    if y+1 < Y_SIZE-1:
        _connect_check_rec(field, check, connect_list, x, y+1, x, y)
    if y-1 >= 0:
        _connect_check_rec(field, check, connect_list, x, y-1, x, y)
    if x+1 < X_SIZE:
        _connect_check_rec(field, check, connect_list, x+1, y, x, y)
    if x-1 >= 0:
        _connect_check_rec(field, check, connect_list, x-1, y, x, y)


def _chain(field, check, connect_list, chain):
    col_set = set()
    erase = 0
    for y in range(Y_SIZE-1):
        for x in range(X_SIZE):
            if check[y][x][0] >= 4:
                erase += 1
                col = field[y][x]
                col_set.add(col)
                field[y][x] = "0"
                if (y+1 < Y_SIZE-1) and field[y+1][x] == "9":
                    field[y+1][x] = "0"
                if (y-1 >= 0) and field[y-1][x] == "9":
                    field[y-1][x] = "0"
                if (x+1 < X_SIZE) and field[y][x+1] == "9":
                    field[y][x+1] = "0"
                if (x-1 >= 0) and field[y][x-1] == "9":
                    field[y][x-1] = "0"

    connect_bonus = 0
    for con in connect_list:
        con_size = con[0]
        idx = (11 if con_size > 11 else con_size) - 4
        connect_bonus += _CONNECT_BONUS[idx]

    color_num = len(col_set)
    color_bonus = _COLOR_BONUS[color_num - 1]

    chain_bonus = _CHAIN_BONUS[chain - 1]

    bonus = connect_bonus + color_bonus + chain_bonus
    if bonus == 0:
        bonus = 1

    score = erase * bonus * 10

    return field, score, chain, erase, color_num


def is_empty_field(field):
    for y in range(Y_SIZE):
        for x in range(X_SIZE):
            if field[y][x] != "0":
                return False
    return True


def field_cotains_color(field, col):
    for y in range(Y_SIZE):
        for x in range(X_SIZE):
            if field[y][x] == col:
                return True
    return False
