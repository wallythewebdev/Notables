// trying out some new features I have just learnt
var updateScreen = function(title, Des){
    var text, newText;

    var nTitle = title;
    var nDes = Des;

    text = '<div class="note"><div class="details"><h2 class="title">%title%</h2><p class="description">%Des%</p></div><div class="options"><button class="edit">edit</button><button class="complte">complete</button></div></div>'

    newText = text.replace('%title%', nTitle);
    newText = newText.replace('%Des%', nDes);

    document.querySelector('section').insertAdjacentHTML("beforeend", newText);
}


