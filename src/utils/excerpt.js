export function truncateContent(content) {
    let idx = content.indexOf("<!-- split -->");
    let excerpt = content.substring(0, idx);
    return excerpt;
}

export function isContentContainExcerpt(content) {
    //判断文章有没有包含摘要，文章主体和摘要用这个标识符分割
    let excerpt = content.indexOf("<!-- split -->");
    let isContain = true;
    if (excerpt === -1) {
        isContain = false;
    }
    return isContain;
}