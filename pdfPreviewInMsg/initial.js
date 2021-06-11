/*
----------------------------------------------------------------
This extension for Thunderbird was made by : e-gaulue & rholeczy
                        © 2021
----------------------------------------------------------------
*/


var divCree = false;

browser.runtime.onMessage.addListener((data, sender) => { // RH : Listener if we received a message.

    if (data.dernierePage == true) {
        document.getElementById("monloader").setAttribute("style", "display:none");
    }

    if (data.file_type == "waiter") {

        if (divCree == false) {

            // RH : We build the html page for preview the message.
            var bodyA = document.body.innerHTML;
            document.body.innerHTML = '';

            var grandeDiv = document.createElement('div');
            grandeDiv.setAttribute("style", 'display: flex;');
            document.body.appendChild(grandeDiv);
            grandeDiv.id = "GrandeDiv";

            var DivPremiere = document.createElement('div');
            grandeDiv.appendChild(DivPremiere);
            DivPremiere.setAttribute("style", "flex-grow: 1");
            DivPremiere.innerHTML = bodyA;

            var DivSecond = document.createElement('div');
            DivSecond.setAttribute("style", "width: 170px;padding-left:5px;");
            grandeDiv.appendChild(DivSecond);


            DivPremiere.id = "DivPremiere";
            DivSecond.id = "second";



            var loader = new Image();
            loader.id = "monloader";
            loader.src = data.img;
            DivSecond.appendChild(loader);
            divCree = true;
        }
    }

    if (data.type === 'handle_me') {

        var image = new Image();
        image.src = data.image;
        image.setAttribute("style", "width:160;margin-bottom:10px;border:1px solid black;"); // RH : This is the image who contains the page of the pdf document or just the image of the attachment.

        image.addEventListener('click', event => {

            browser.runtime.sendMessage({ "part_name": data.part_name, "numPage": data.numPage, "messageId": data.messageId }); //We send a message when we click on an page or image.
        });

        document.getElementById("second").insertBefore(image, document.getElementById("monloader")); //We put the image before the last element.

        return Promise.resolve('done');
    }
    return false;
});

browser.runtime.sendMessage({ 'initialized': true });