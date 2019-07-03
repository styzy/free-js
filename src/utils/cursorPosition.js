// 获取光标位置
const get = function(win) {
    win = win || window;
    var doc = win.document;
    var sel = doc.selection,
        range, rects, rect;
    var x = 0,
        y = 0;
    if (sel) {
        if (sel.type != "Control") {
            range = sel.createRange();
            range.collapse(true);
            x = range.boundingLeft;
            y = range.boundingTop;
        }
    } else if (win.getSelection) {
        sel = win.getSelection();
        if (sel.rangeCount) {
            range = sel.getRangeAt(0).cloneRange();
            if (range.getClientRects) {
                range.collapse(true);
                rects = range.getClientRects();
                if (rects.length > 0) {
                    rect = rects[0];
                }
                if (rect) {
                    x = rect.left;
                    y = rect.top;
                }
            }
            if ((x == 0 && y == 0) || rect === undefined) {
                var span = doc.createElement("span");
                if (span.getClientRects) {
                    span.appendChild(doc.createTextNode("\u200b"));
                    range.insertNode(span);
                    rect = span.getClientRects()[0];
                    x = rect.left;
                    y = rect.top;
                    var spanParent = span.parentNode;
                    spanParent.removeChild(span);
                    spanParent.normalize();
                }
            }
        };
    };
    var scrollTop = 0,
        scrollLeft = 0;
    if (document.documentElement && document.documentElement.scrollTop) {
        scrollTop = document.documentElement.scrollTop
        scrollLeft = document.documentElement.scrollLeft
    } else if (document.body) {
        scrollTop = document.body.scrollTop
        scrollLeft = document.body.scrollLeft
    }
    return {
        x: x + scrollLeft,
        y: y + scrollTop
    };
};
// 设置光标位置
const set = function(element, pos) {
    var range, selection;
    if (document.createRange) {
        range = document.createRange();
        range.selectNodeContents(element);
        if (element.innerHTML.length > 0) {
            range.setStart(element.childNodes[0], pos);
        }
        range.collapse(true);
        selection = window.getSelection();
        selection.removeAllRanges();
        selection.addRange(range);
    } else if (document.selection) {
        range = document.body.createTextRange();
        range.moveToElementText(element);
        range.collapse(false);
        range.select();
    }
};

const cursorPosition = {
    get: get,
    set: set
}

export default cursorPosition