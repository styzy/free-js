const importNode = function(node, deep) {
    if (!document.ELEMENT_NODE) {
        document.ELEMENT_NODE = 1;
        document.ATTRIBUTE_NODE = 2;
        document.TEXT_NODE = 3;
        document.CDATA_SECTION_NODE = 4;
        document.ENTITY_REFERENCE_NODE = 5;
        document.ENTITY_NODE = 6;
        document.PROCESSING_INSTRUCTION_NODE = 7;
        document.COMMENT_NODE = 8;
        document.DOCUMENT_NODE = 9;
        document.DOCUMENT_TYPE_NODE = 10;
        document.DOCUMENT_FRAGMENT_NODE = 11;
        document.NOTATION_NODE = 12;
    }
    switch (node.nodeType) {
        case document.ELEMENT_NODE:
            var newNode = document.createElement(node.nodeName);
            if (node.attributes && node.attributes.length > 0)
                for (var i = 0, length = node.attributes.length; i < length; i++) {
                    newNode.setAttribute(node.attributes[i].nodeName, node.getAttribute(node.attributes[i].nodeName));
                }
            if (deep && node.childNodes && node.childNodes.length > 0)
                for (var i = 0, length = node.childNodes.length; i < length; i++) {
                    newNode.appendChild(importNode(node.childNodes[i], deep))
                }
            return newNode;
            break;
        case document.TEXT_NODE:
        case document.CDATA_SECTION_NODE:
        case document.COMMENT_NODE:
            return document.createTextNode(node.nodeValue);
            break;
    }
}

export default importNode