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
            html = '<div class="note fade-in" id="noteNumber__%noteID%"><div class="details"><h2 class="title">%noteTitleText%</h2><p class="description">%noteDescriptionText%</p></div><div class="options"><button>edit</button><button class="complete">complete</button></div></div>';
            html = html.replace('%noteID%', id);
            updateHTML = html.replace('%noteTitleText%', title);
            updateHTML = updateHTML.replace('%noteDescriptionText%', description);

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
            var id;

            // give the note an ID >>> id will always be one higher than highest number
            if(notesData.length > 0){
                id = notesData[notesData.length -1].id + 1; // <<<< need to check this and the completed notes as well
            } else {
                id = 0;
            }
            // create object
            var usersNote = new Note(title, description, id);
            // push to the data structure (array)
            notesData.push(usersNote);
            // retur the object
            console.log(usersNote);
            return usersNote;
        },

        // Push Loaded Notes & completd

        pushLoaded_Completed: function(title,des,id){
            // creates an object Note >>> using the localStored data
            var usersNote = new Note(title, des, id);
            // pushed localStored data to array
            completedNotes.push(usersNote);
        },

        pushLoaded: function(title,des,id){
            // creates an object Note >>> using the localStored data
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

        deleteNote: function(noteID, index){
            // debugger;
            var el;


            // delete note note from the backend
            notesData.splice(index,1);

            backendControlls.CL_notesData();
            // console.log(backendControlls.completedNotes);

            // delete note from the UI
            el = document.getElementById(noteID);
            el.parentElement.removeChild(el);


        },


        // this function needs work! 
        comapreSave_to_Local: function(){
            debugger;
            // // create an array of current stored notes
            let currentSavedNotes, currentSavedNotes_completed, localNoteId, localCompleteId;


            currentSavedNotes = JSON.parse(window.localStorage.getItem('Notables_userNotes')); // << get note
            var savedID = currentSavedNotes.map(e => e.id) // << store note ids in array 
            console.log(savedID);
            currentSavedNotes_completed = JSON.parse(window.localStorage.getItem('Notables_userNotes_completed')); // get notes
            var savedCompledID = currentSavedNotes_completed.map(e => e.id) // << store notes Id in array

            // compare the two arrays and return the duplicates if any
            // if the id exists in .window storage, do not re-save it 
            // if statment 

            localNoteId = notesData.map(e => e.id); // << may be redundant to write a var for this
            console.log(localNoteId);
            localCompleteId = completedNotes.map(e => e.id); // << may be redundant to write a var for this

            var noteResult = localNoteId.filter(e=>savedID.indexOf(e) != 1);
            
            console.log(noteResult);
        },

        saveNote: function(){   

            if(completedNotes.length > 0){
                var completedNotesString = JSON.stringify(completedNotes);
                window.localStorage.setItem('Notables_userNotes_completed', completedNotesString);
            }
            // bug where double saving notes
            // if notes more than 0 && notes id do not match current notes?
            if(notesData.length > 0){
                var noteS = JSON.stringify(notesData); // convert the notes to string 
                window.localStorage.setItem('Notables_userNotes', noteS); // pass string to local storage
            }
            
        },


        // delete later - this is for debuggin
        returnNotes: function(){
            return notesData;
        },
        // delete later - this is for debuggin
        CL_complete: function(){
            console.log(completedNotes);
        },
        // CONSOLE LOG NOTES LIST FOR CHECKS
        CL_notesData: function(){
            console.log(notesData);
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
        document.querySelector(DOMS.noteIncert).addEventListener('click', noteCompleted);

        // save note
        document.querySelector(DOMStrings.save).addEventListener('click', saveNote);

        // load a note
        document.querySelector(DOMStrings.load).addEventListener('click', loadNotes);

        // note history
        document.querySelector(DOMStrings.history).addEventListener('click', noteHistory)
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
            }
            
    }

        var noteCompleted = function(event){
            // debugger;
            var completedButton, noteID, noteSplit, noteSplitID;
            if(event.target.classList.value === 'complete'){ // event.target.classList.<VALUE> was missing 
                completedButton = event.target;

                // find the note id
                noteID = completedButton.parentNode.parentNode.id

                // remove that note from notes 
                // split the noteID to find the number of the note 

                noteSplit = noteID.split('__');
                noteNumber = noteSplit[1];
                noteSplitID = parseInt(noteNumber);
                
                // pass note to the completed notes
                // debugger
                var index = BEctrl.pushToCompleted(noteSplitID);

                // delete the note from the unsaved Notes
                BEctrl.deleteNote(noteID, index);
            }
        }

        var saveNote = function(){
            BEctrl.saveNote();
        }

        var loadNotes = function(){
            // clear the current notes from the screen
            // a) unless they are not saved
            document.querySelector(DOMStrings.noteIncert).innerHTML="";

            let notesFromStorage;
            // load local stored notes - 
            notesFromStorage = JSON.parse(window.localStorage.getItem('Notables_userNotes'));
            notesFromStorage.forEach(e => BEctrl.pushLoaded(e.title,e.description,e.id));
            notesFromStorage.forEach(e => uiControlls2.embedHTML(e.title,e.description,e.id))

            // add completed notes
            let notesFromStorage_compled;
            notesFromStorage_compled = JSON.parse(window.localStorage.getItem('Notables_userNotes_completed'));
            notesFromStorage_compled.forEach(e=> BEctrl.pushLoaded_Completed(e.title, e.description, e.id));
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

    return{
        init: function(){
            eventListeners();
            loadNotes();
        }
    }

})(uiControlls2,backendControlls);

controller.init();