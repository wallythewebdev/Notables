// 1) get the value from the input 
/*
    - click submit
    event listener
    - values taken
    read values
    - values stored 
    push into data storage


*/ 


// BUG is that saved notes can double save there id's 





// UI controlls
const uiControlls2 = (function(){
    // DOMStrings
    const DOMStrings = {
        noteTitle: '.noteTitle',
        noteDescription: '.noteDescription',
        noteSubmit: '.noteSubmit',
        noteIncert: 'section',
        localStorageNotes: 'noteables_stored_notes',
        save: '.save_Note',
        history: '.note_history',
        load: '.load_note',
        clear: '.clear_all'
        
    } 

    return{
        getDomStrings: function(){
            return DOMStrings;
        },

        getData: function(){
            var title = document.querySelector(DOMStrings.noteTitle).value;
            var description = document.querySelector(DOMStrings.noteDescription).value;
            return {title, description}
        },

        embedHTML: function(title, description, id){
            var html, updateHTML;            
            html = '<div class="note fade-in" id="noteNumber__%noteID%"><div class="details"><h2 class="title">%noteTitleText%</h2><p class="description">%noteDescriptionText%</p></div><div class="options"><button class="edit">edit</button><button class="complete">complete</button></div></div>';
            html = html.replace('%noteID%', id);
            updateHTML = html.replace('%noteTitleText%', title);
            updateHTML = updateHTML.replace('%noteDescriptionText%', description);
            updateHTML = updateHTML.replace('%noteID%', id);

            document.querySelector(DOMStrings.noteIncert).insertAdjacentHTML('beforeend', updateHTML);
        },

        embedHTML_completed: function(title, description, id){
            var html, updateHTML;            
            html = '<div class="note fade-in" id="noteNumber__%noteID%"><div class="details"><h2 class="title">%noteTitleText%</h2><p class="description">%noteDescriptionText%</p></div><div class="options_completed"><button class="edit_complete">edit</button></div></div>'; // << removed the completed button from the code as it is not needed
            html = html.replace('%noteID%', id);
            updateHTML = html.replace('%noteTitleText%', title);
            updateHTML = updateHTML.replace('%noteDescriptionText%', description);

            document.querySelector(DOMStrings.noteIncert).insertAdjacentHTML('beforeend', updateHTML);
        },

        clearText: function(){
            // document.querySelector(DOMStrings.noteTitle).value="";
            // document.querySelector(DOMStrings.noteDescription).value="";

            // alt version of this
            var inputFields, fieldsArr;

            // create a nodeList for the inputs that need to removed
            inputFields = document.querySelectorAll(`${DOMStrings.noteTitle},${DOMStrings.noteDescription}`);

            // convet the node list to an array
            fieldsArr = Array.prototype.slice.call(inputFields);

            // cycle thought the array and remove the value of the Elements
            fieldsArr.forEach((e)=>{
                e.value="";
            })
            fieldsArr[0].focus();
        },

        editUI_note: function(targetE){
            // debugger;

                

                // A) - get the title and description + current values (of text)
                var title = targetE.parentElement.parentElement.firstElementChild.children[0]
                let titleText = title.innerHTML;
                var des = targetE.parentElement.parentElement.firstElementChild.children[1]
                let desText = des.innerHTML;


                // B) create the elements and assign them the text values so user can see what they are edditing
                let inputTitle = document.createElement('input');
                inputTitle.setAttribute('type','text');
                inputTitle.value=titleText;

                let inputDes = document.createElement('input');
                inputDes.setAttribute('type','text');
                inputDes.value=desText;

                
                // C) replace the title with the input to make edits
                title.replaceWith(inputTitle);
                des.replaceWith(inputDes);

                // D) chnage the edit button to the SAVE button 

                targetE.innerHTML="SAVE"

                // E) change complete to EXIT + add event listeneer to it 

                targetE.parentElement.children[1].innerHTML="EXIT";
                targetE.parentElement.children[1].addEventListener('click',function(){
                    backendControlls.loadNote();
                })
        }
    }

})();



// Backend Controlls

    var DOMStrings = uiControlls2.getDomStrings(); // <<<<< WHY? - think about this when not hungover

    const backendControlls = (function(){

    // create a data object for the note

    var Note = function(title, description, id){
        this.title = title;
        this.description = description;
        this.id = id;
    }
    
    // Data storage

    var notesData = [];

    var completedNotes = [];

    return{


        // STORE NOTES - 
        storeNote: function(title,description){
          

            let id, idComp;

            // A) -- if no ID set ID as 0 / else set ID as ID.length + 1
            if(notesData.length === 0){
                id = 0
            }
            else if(notesData.length > 0){
                id = notesData[notesData.length -1].id + 1; // <<<< need to check this and the completed notes as well
            }

            // B) repeat A for complete notes
            if(completedNotes.length === 0){
                idComp = 0
            } else if(completedNotes.length > 0) {
                    idComp = completedNotes[completedNotes.length -1].id +1
            }

            // C) checks - find highest number for ID
            if(id === idComp){
                var usersNote = new Note(title, description, id);
            }
            else if(id > idComp) {
                // create object using id number
                var usersNote = new Note(title, description, id);
            } else if (idComp > id){
                var usersNote = new Note(title, description, idComp);
            }
            
            notesData.push(usersNote);
            return usersNote; // << used in another function so returned 
        },

        // Push Loaded Notes & completd

        pushLoaded_Completed: function(title,des,id){
            // creates an object Note >>> using the localStored data
            var usersNote = new Note(title, des, id);
            // pushed localStored data to array
            completedNotes.push(usersNote);
        },

        pushLoaded: function(title,des,id){
            // debugger;
            // creates an object Note >>> using the localStored data
            // Only create the note and push it if the id is not found already: 

            

            var usersNote = new Note(title, des, id);
            // pushed localStored data to array
            notesData.push(usersNote);
            
        },
        

        pushToCompleted: function(noteSplitID){
            // debugger;
            var ids, index;

            ids = notesData.map(current => current.id)

            index = ids.indexOf(noteSplitID);

            completedNotes.push(notesData[index]);
            
            return index;
        },

        deleteAllDevice: function(){
            notesData = [];
            completedNotes = [];
        },

        deleteNote: function(noteID, index, noteSplitID){
            // debugger;
            var el, windowStorage;


            // delete note note from the backend
            notesData.splice(index,1);

            backendControlls.CL_notesData();
            // console.log(backendControlls.completedNotes);

            // delete note from the UI
            el = document.getElementById(noteID);
            el.parentElement.removeChild(el);

            // delete the note from the window.localStoragae
            windowStorage = JSON.parse(window.localStorage.getItem('Notables_userNotes'));
            if(windowStorage != null){
                let noteArr_id = windowStorage.map(e=>e.id)
                noteArr_id = noteArr_id.indexOf(noteSplitID);
                windowStorage.splice(noteArr_id,1);
                window.localStorage.setItem('Notables_userNotes', JSON.stringify(windowStorage));
            }
        },

        compare_notes: function(){
            let notes, notesLocal, comapredNotes;

            // get all IDS - notes
            notes = notesData.map(e=>e.id);
            notesLocal = JSON.parse(window.localStorage.getItem('Notables_userNotes')).map(e=>e.id);

            comapredNotes = notesLocal.filter(function(notesLocal) {
                return notes.indexOf(notesLocal) != -1;
              });

            return comapredNotes;

        },

        updateNoteContent: function(mouseClick){
            
            // debugger;
            
            // A) get new values from inputs
            let newTitle = mouseClick.target.parentNode.parentNode.children[0].children[0].value;
            let newDes = mouseClick.target.parentNode.parentNode.children[0].children[1].value;

            if(newTitle === "" && newDes === ""){
                backendControlls.loadNote();
            } else {
            
            // test that values are being found
            console.log(`updated details: ${newTitle} and ${newDes}`);

            // B) get current ID 

            let elementID = mouseClick.target.parentNode.parentNode.id;
            elementID = elementID.split('__');
            elementID = parseInt(elementID[1]) // << this returns the number of ID

            // update the current values against the same note with the ID 
            // find the index of the current ID in the notes ID


            // find the indexOf note in total notes
            var notePos = notesData.map(current => current.id)
            notePos = notePos.indexOf(elementID);

            // create constructor object
            var noteUpdate = new Note(newTitle, newDes, elementID);

            // re-write the note with the new details
            notesData[notePos] = noteUpdate;

            backendControlls.saveNote()
            backendControlls.loadNote();
            }
     
        },

        // This needs to be a simple function
        // being passed the correct array to save 
        // from the notes and completed notes 
        // check() > return Arrs > Save(note,completeNote)
        saveNote: function(){


                var noteData_string = JSON.stringify(notesData);
                window.localStorage.setItem('Notables_userNotes', noteData_string);

                var completedNotesString = JSON.stringify(completedNotes);
                window.localStorage.setItem('Notables_userNotes_completed', completedNotesString);

        },

        loadNote: function(){

            document.querySelector(DOMStrings.noteIncert).innerHTML=""; // << clear notes from UI
            let notesFromStorage, comp_notesFromStorage;

            backendControlls.deleteAllDevice();


            // Improvement - would be to create a function that takes the data and passes it to the forEach for the pushing of notes
            
            notesFromStorage = JSON.parse(window.localStorage.getItem('Notables_userNotes'));
            notesFromStorage.forEach(e => backendControlls.pushLoaded(e.title,e.description,e.id));
            notesFromStorage.forEach(e => uiControlls2.embedHTML(e.title,e.description,e.id))

            comp_notesFromStorage = JSON.parse(window.localStorage.getItem('Notables_userNotes_completed'));
            comp_notesFromStorage.forEach(e => backendControlls.pushLoaded_Completed(e.title, e.description, e.id))
            
        },


        // delete later - this is for debuggin
        returnNotes: function(){
            return notesData;
        },
        // delete later - this is for debuggin
        CL_complete: function(){
            return completedNotes
        },
        // CONSOLE LOG NOTES LIST FOR CHECKS
        CL_notesData: function(){
            return notesData
        } 
    }
   
})()


// controller
const controller = (function(UIctrl,BEctrl){

    getDomStrings = function(){
        var DOMStringsList = UIctrl.DOMStrings;
        return DOMStringsList;
    }

    // set up event listeners
    var eventListeners = function(){
        var DOMS = UIctrl.getDomStrings();
        // adding a note 
        document.querySelector(DOMS.noteSubmit).addEventListener('click',noteSubmitted);

        // add enter clicked to add note
        document.addEventListener('keypress',function(e){
            if(e.code === "Enter" || e.keyCode === 13){
                noteSubmitted();
            }
        })

        // completing a note
        document.querySelector(DOMS.noteIncert).addEventListener('click', noteCompleted); // << this is using event bubbling (probably should change how the edit event is being handles)

        // save note
        document.querySelector(DOMStrings.save).addEventListener('click', saveNote);

        // load a note
        document.querySelector(DOMStrings.load).addEventListener('click', loadNotes);

        // note history
        document.querySelector(DOMStrings.history).addEventListener('click', noteHistory)

        // edit button
        document.addEventListener('click', clickFunctions)
    }

    // 
        var noteSubmitted = function(){
            // 1 get the input from the user
            var userNote = uiControlls2.getData();
            console.log(userNote);
            // 2 run check to make sure that it is valid
            // check is - if title and description have text run if not return
            if(userNote.title !== "" && userNote.description !== ""){
                // 3 turn that data into an object using the function constucture
                var noteObject = BEctrl.storeNote(userNote.title, userNote.description);
                console.log(noteObject);
                // 4 populate the not to the UI for the user
                uiControlls2.embedHTML(noteObject.title, noteObject.description, noteObject.id)
                // 5 clear the text from the UI screen
                uiControlls2.clearText();
                // save the notes to the
                // 6 save the note auto 
                backendControlls.saveNote();
            }
            
    }

        var noteCompleted = function(event){
            
                 // debugger;
            var completedButton, noteID, noteSplit, noteSplitID;
            if(event.target.classList.value === 'complete' && event.target.innerHTML === 'complete'){ // event.target.classList.<VALUE> was missing 
                completedButton = event.target;

                // find the note id
                noteID = completedButton.parentNode.parentNode.id

                // split the noteID to find the number of the note 

                noteSplit = noteID.split('__');
                noteNumber = noteSplit[1];
                noteSplitID = parseInt(noteNumber);
    
                // debugger;
                // pass note to the completed notes
                // debugger
                var index = BEctrl.pushToCompleted(noteSplitID);

                // remove note from the note array -

                // delete the note from the unsaved Notes
                BEctrl.deleteNote(noteID, index, noteSplitID);

                // save the updates
                BEctrl.saveNote();
            } else if (event.target.innerHTML === 'EXIT'){
                console.log('run for the hills')
            }
            
           
        }

        var saveNote = function(){
            BEctrl.saveNote();
        }


        /*******************
         * 
         * 
         * 
         * 
         * **********************/ 
        var loadNotes = function(){

            
            document.querySelector(DOMStrings.noteIncert).innerHTML=""; // << clear notes from UI

            let notesFromStorage;
            
            // if noteID is found in local note do not pass it to local note again

            // hacky - delete the notes on the local first so loading into a blank slate each time

            BEctrl.deleteAllDevice();

            if(window.localStorage.getItem('Notables_userNotes') != null){
                notesFromStorage = JSON.parse(window.localStorage.getItem('Notables_userNotes'));
                notesFromStorage.forEach(e => BEctrl.pushLoaded(e.title,e.description,e.id));
                notesFromStorage.forEach(e => uiControlls2.embedHTML(e.title,e.description,e.id))
            }
            

            // add completed notes
            let notesFromStorage_compled;
            notesFromStorage_compled = JSON.parse(window.localStorage.getItem('Notables_userNotes_completed'));
            if(notesFromStorage_compled != null){

                notesFromStorage_compled.forEach(e=> BEctrl.pushLoaded_Completed(e.title, e.description, e.id));
            }
            
        }

        var noteHistory = function(){
            // debugger;
            let completedNotes_stored, currentUI;

            // get the notes that have been completed
            completedNotes_stored = JSON.parse(window.localStorage.getItem('Notables_userNotes_completed'));


            // remove the notes currently being showed / if any?
            document.querySelector(DOMStrings.noteIncert).innerHTML='';

            // populate the UI with the completed notes
            completedNotes_stored.forEach(e=>uiControlls2.embedHTML_completed(e.title,e.description,e.id));

        }

        var clickFunctions = function(e){
            let targetE = e.target;

            // ******** EDIT *********** BUTTON CLICKED
            if(targetE.classList.value === 'edit' && targetE.innerHTML === 'edit'){

                // change fields to inputs
                UIctrl.editUI_note(targetE)

                // event listener for Save button
                if(targetE.innerHTML === "SAVE"){
                    targetE.addEventListener('click', BEctrl.updateNoteContent)
                    
                }
            }
            

        }

    return{
        init: function(){
            eventListeners();
            loadNotes();
        }
    }

})(uiControlls2,backendControlls);

controller.init();