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
        complete.addEventListener('click', function(){
            var div = document.createElement('div');
            div.innerText="Confirm?";
            div.className="confirm fade-in";
            note.appendChild(div);
            // 2)
            div.addEventListener('click',function(){
                div.className="confirm fade-away";
                // >>>> Assign the note completed animation
                document.querySelectorAll('.note')[noteNumber].className="note noteCompleted";
                // A)
                dataStorage.completedNotes.push(dataStorage.notes[noteNumber]);
                // A-2)
                dataStorage.notes.splice(noteNumber,1);
                // B)
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

// 4) ----- create a populate the html with the the details of the note 




// testing for local storage - 

var localNotes = [
    {
    title: 'Go Running',
    description: 'to be healthly'
    }, 
    {
        title: 'Learn cooking',
        description: 'to get some BF points from the misses'
    },
    {
        title: 'Wake Up Early',
        description: 'To get a kick start on the day ahead'
    }
]