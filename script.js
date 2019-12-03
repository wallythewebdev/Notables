
const generalCommands = {


    // I need to be able to have the warning message pop up and return if yes was clicked or no

    warningPrompt: function(messageText){
        // apply the show to the warning box 

        document.querySelector('.warningBox').classList.add('warningBox_show');

        // debugger;
        var checked = null;
        // create a pop-up box that is a yes or no answer
        
        // take a input for the text of the warning "X" is the text

        // return if YES or NO is clicked
        var buttonYES = document.querySelector('button.YES');
        var buttonNO = document.querySelector('button.NO');
        buttonYES.addEventListener('click',function(){
            checked = true;
            return checked;
        });
        buttonNO.addEventListener('click',function(){
            checked = false;
            return checked;
        })
        

    },

    // delete notes from screen && from local note if not saved
    clearNotes: function(){

       var checked = generalCommands.compareNotes();

        // use a promise instead - 
        // if there are no notes or notes length is 0 - return as nothing needs to be saved
        if(dataStorage.notes === null || dataStorage.notes.length === 0 || checked === 1){
            return;
        } 
        // else > show warning to user that un-saved notes 
        else {
            if(confirm('Any not saved data will be deleted')){
                document.querySelector('section').innerHTML="";
                dataStorage.notes=[];
            } else {
                return
            }
        }
           
        
        
    },

    compareNotes: function(){
        var notesSavedOnline = JSON.parse(window.localStorage.getItem('notes'));
        var localUnsavedNotes = dataStorage.notes;

        // String the two to comapre them

        notesSavedOnline = JSON.stringify(notesSavedOnline);
        localUnsavedNotes = JSON.stringify(localUnsavedNotes);

        // Check to see if they are they same ---- 
        // return 1 if true 0 if false

        // Maybe could use a turnery operator below instead of the if or else statment??????

        if(notesSavedOnline === localUnsavedNotes) {
            return 1;
        } else {
            return 0
        }

    }

}


// 1) ----- get the inputs from the form when the user clicks submit 
// dont get the inptus if they have left out a field

const uiControlls = {

    // get the values

    getNote: function(){
        // debugger
        var noteTitle = document.querySelector('input[name="noteTitle"]');
        var noteDescription = document.querySelector('input[name="noteDescription"]');
        dataStorage.notes.push({
            title: noteTitle.value,
            description: noteDescription.value
        })
        noteTitle.value="";
        noteDescription.value="";

        // call population automatically once you hit submit -

        
            population.createNotes();
        
        
    }

    
}

// 2) ----- store the information in the local cahce of the browser

const dataStorage = {
    notes: [], 

    completedNotes: []
}

const pushData = {
    
    pushLocal: function(){
        // debugger;
        // If there is **not** a notes list already in local storage then take the notes in 
        // dataStorage.notes and upload it to local storage
        var isNotes = window.localStorage.getItem('notes');
        if(isNotes === null){
        window.localStorage.setItem('notes',JSON.stringify(dataStorage.notes));
        }
    }, 

    pullLocal: function(){
        // clear current notes if any
        generalCommands.clearNotes();
        // create a check to see if you have unsaved notes

        // pull notes from local storage
        // dataStorage.notes.push(JSON.parse(window.localStorage.getItem('notes'))); ******************<<<<<<<<<<<< prior value
        // create the notes in the window for the user to see
        // *********** bug **************
        // if there is only one note in the local storage then the aplcation will not pull the data 

        // BETTER WAY BELOW - 

        // get the notes
        var localStoedNotes = JSON.parse(window.localStorage.getItem('notes'));
        // for each of the notes push the note (object) to the dataStorage
        localStoedNotes.forEach(e=>dataStorage.notes.push(e));



        population.createNotes();


    },

    combineData: function(){
            debugger;
            // get the local notes
            var created_notes = dataStorage.notes;
            // get the local-storage notes
                var local_stored_notes = JSON.parse(window.localStorage.getItem('notes'));
            // check to see if there is any local-stored notes
                if( local_stored_notes === null){
                    window.localStorage.setItem('notes',JSON.stringify(local_stored_notes));
                    // remove the notes from the data-stored notes
                    dataStorage.notes=[];
                    return
                }   else {
                    var combinedNotes = created_notes.concat(local_stored_notes);
                    console.log(combinedNotes);
                    // remove the current array -
                        window.localStorage.removeItem('notes');
                    // set a new updated array of notes
                        window.localStorage.setItem('notes',JSON.stringify(combinedNotes));
                    // reset the current notes - 
                    dataStorage.notes=[]
                    
                }

            

            // combine them into a new array

            // return the new array
           
    },

    saveNotes: function(){
        // push the notes to the local storage
        
        
       
        window.localStorage.setItem('notes',JSON.stringify(dataStorage.notes));
    }
}

// 3) ----- create the elements for the div 

const population = {

    createNotes: function(){
        
        document.querySelector('section').innerHTML="";
        for(i=0;i<dataStorage.notes.length;i++){
            var title = dataStorage.notes[i].title;
            var description = dataStorage.notes[i].description;
            this.createNoteElements(title, description, i);

        }
    },

    createLocalStorangeNotes: function(){
        // debugger;
        document.querySelector('section').innerHTML="";
        for(i=0;i<dataStorage.notes[0].length;i++){
            var title = dataStorage.notes[0][i].title;
            var description = dataStorage.notes[0][i].description;
            this.createNoteElements(title, description, i);

        }

    },

    createNoteElements: function(title,description, i){
        // create dives
        // perant >>>> 

        let noteNumber = i;

        let note = document.createElement('div');
        note.className="note fade-in";
        // siblings >>>>
        let details = document.createElement('div')
        details.className="details";
        let options = document.createElement('div')
        options.className="options";

        // **************** details

        // TITLE >>>>> 
        let h2 = document.createElement('h2');
        h2.innerHTML=title;
        h2.className="title";
        // DESCRIPTION >>>>>
        let p = document.createElement('p');
        p.innerHTML=description;
        p.className="description";

        details.appendChild(h2);
        details.appendChild(p);

        // **************** options
        let edit = document.createElement('button');
        edit.innerHTML="edit".className="edit";
        
        var complete = document.createElement('button');
        complete.innerHTML="complete".className="complete";
        // ************************
        //  CLICK EVENT FOR COMPLETED BUTTON BELOW
        // 1) create Confirm div + assign it styles
        // 2) if confirm clicked - store the note in A) completed notes A-2) Remove note from current notes > and B) reload the notes
        // ************************
        // 1)
        
        var completeDuplicated;
            complete.addEventListener('click', function(){
                
                if (completeDuplicated === undefined){
                    completeDuplicated = 1
                    var div = document.createElement('div');
                    div.innerText="Confirm?";
                    div.className="confirm fade-in";
                    note.appendChild(div);
                    // 2)
                } 
                
                else{return}
                
               
                div.addEventListener('click',function(){
                   
                    div.className="confirm fade-away";
                    // >>>> Assign the note completed animation
                    document.querySelectorAll('.note')[noteNumber].className="note noteCompleted";
                    // A)
                    dataStorage.completedNotes.push(dataStorage.notes[noteNumber]);
                    // A-2)
                    dataStorage.notes.splice(noteNumber,1);
                    // B) - timeout function here is so that the animations line up -
                    setTimeout(function(){
                        population.createNotes();
                    },1000)
                })
            })
                
                
        
        

        options.appendChild(edit);
        options.appendChild(complete);

        // Append 
        note.appendChild(details);
        note.appendChild(options);

        const section = document.querySelector('section');
        section.appendChild(note);
    }
}



