import lib.puyopuyo as pypy
import copy


Q_CHAIN = "1"
Q_ERASE_ALL = "2"
Q_ERASE_COLOR = "3"
Q_MULTI_COLOR = "4"
Q_MULTI = "5"


def solve(field_str, tsumo_str, q_type, q_require):
    answer_list = []
    field = pypy.field_str_to_array(field_str)
    _solve_rec(field, tsumo_str, q_type, q_require, 0, [], answer_list)
    return answer_list


def _solve_rec(field, tsumo_str, q_type, q_require, index, tsumo_list, answer_list):
    if len(answer_list) >= 10:
        return

    if index >= len(tsumo_str)/2:
        return

    a_col = tsumo_str[index*2]
    c_col = tsumo_str[index*2+1]
    for c_pos in pypy.CHILD_POSITION.keys():
        if (a_col == c_col) and (c_pos == "BOTTOM" or c_pos == "LEFT"):
            continue

        for a_x in range(6):
            if (a_x == 0) and (c_pos == "LEFT"):
                continue
            if (a_x == 5) and (c_pos == "RIGHT"):
                continue
            if not pypy.check_droppable(field, a_x, c_pos):
                continue

            tsumo = {
                "axisColor": a_col
                , "childColor": c_col
                , "axisX": a_x
                , "position": c_pos
            }
            tsumo_list_copy = copy.copy(tsumo_list)
            tsumo_list_copy.append(tsumo)
            field_copy = copy.deepcopy(field)
            field_copy, chain_info = pypy.drop_tsumo_to_field(field_copy, a_col, c_col, a_x, c_pos)

            if _correct_check(field_copy, chain_info, q_type, q_require):
                answer_list.append(tsumo_list_copy)

            _solve_rec(field_copy, tsumo_str, q_type, q_require, index+1, tsumo_list_copy, answer_list)


def _correct_check(field, chain_info, q_type, q_require):
    if q_type == Q_CHAIN:
        if len(chain_info) == 0:
            return False
        chain = max(info["chain"] for info in chain_info if info["chain"])
        req_chain = int(q_require)
        return chain >= req_chain
    elif q_type == Q_ERASE_ALL:
        return pypy.is_empty_field(field)
    elif q_type == Q_ERASE_COLOR:
        req_col = q_require
        return not pypy.field_cotains_color(field, req_col)
    elif q_type == Q_MULTI_COLOR:
        if len(chain_info) == 0:
            return False
        col_num = max(info["color_num"] for info in chain_info if info["color_num"])
        req_color_num = int(q_require)
        return col_num >= req_color_num
    elif q_type == Q_MULTI:
        if len(chain_info) == 0:
            return False
        erase = max(info["erase"] for info in chain_info if info["erase"])
        req_erase = int(q_require)
        return erase >= req_erase
    return False
