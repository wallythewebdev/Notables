# Notables

See the live site here: 

http://wallythewebdev.com/Notables/

This is a note apliaction built out using Vanilla JS - 

I intend to have several versions of this aplcation: 

Road Map: 

v1 - current build

Aplications, takes notes, stores them until they are completed or until the aplcation is reset

v2 - aplcation uses local storage of the device to keep a record of the notes taken for more functioncal use

V2.1 REWORKING 

    1) re work the moudle layout of the JS - :: completed

    controller: controlls buttons of app :: completed

    UIControlls: controlls inputs :: completed

    NoteApp: controlls maths 

    2) add DOMstrings to prevent unwanted bugs from change in classNames down the track :: completed

    3) re-work the functions to be private - use of IIFE and return i.e. 

    var UIcontroller = (function(){
        <!-- PRIVATE -->

        return {
            <!-- PUBLIC -->

        }
    })()

    :: completd 

    3) storing data - create a function constructor for the data being stored: this will allow functions to be assigned to that data VIA 
    the prototype chain

    4) update the created notes > to be inputted via inputAdjacentHTML rather than appending multiple child elements

    5) restructure the data of how the note details are being held

v3 - additional reporting to be added, so, user may better understand there ability to fulfill tasks

v4 - log on system to be implimented so data can be accsessed from multiple platforms

v5 - practices will be implimented into the MEDS aplcation

----

This build will most likerly be rebuilt using a frame work and pointed at as reference. 
