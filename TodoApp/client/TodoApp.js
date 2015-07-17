    //template helpers
    
    Meteor.subscribe('tasks');
    
    Template.body.helpers({
        
         tasks: function(){
             
                if(Meteor.user() != null){

                 if(Session.get('hideCompleted')){
                     return Tasks.find({checked: {$ne: true}});
                 }
                 else{ 
                    return Tasks.find({});
                 }
            }
        },
        
        incompleteCount: function(){
            return Tasks.find({checked: {$ne: true}}).count();
        }
    });
    
    
    //events occuring in the body tag of html
    
    Template.body.events({
        
        'submit .new-task': function(event){
            
            event.preventDefault();
            
            var text = event.target.text.value;
            
            /*Tasks.insert({
                text: text,
                createdAt: new Date(),
                owner: Meteor.userId(), //_id of logged in user
                username: Meteor.user().username //username of logged in user
            });*/
            
            Meteor.call('addTask', text);
            
            event.target.text.value = "";

        },
            
        'change .hide-completed input': function(event){
            Session.set('hideCompleted', event.target.checked);
        }
    });
    
    

    //define helpers on tasks template
    
    Template.task.helpers({
        
        isOwner: function(){
            
            return this.owner === Meteor.userId();
            console.log(JSON.stringify(this));
        }
    });
    

    /*
    Template.task.onRendered(function(){
         console.log("render");

        $(document).on('click', '#save', function(event){
            event.preventDefault();
            alert("hey " + event);
        })
    })
    */
    //define events on the template named 'task'
    
    Template.task.events({
    
        'click .toggle-checked': function(){
            //Tasks.update(this._id, { $set: {checked: ! this.checked}});
            Meteor.call('setChecked', this._id, ! this.checked);
        },
        
        'click .toggle-private':function(){

            console.log(this);
            Meteor.call('setPrivate', this._id, !this.private);
        },
                
        'click .delete': function(){
            Meteor.call('deleteTask', this._id);
            //Tasks.remove(this._id);
        },

        'click .modal-footer #save': function(){
            
            //update the task
            console.log(this);

            //get updated task text from textarea
            var text = $('#' + this._id +' .updatetask')[0].value;
            //call method to update DB
            Meteor.call('updateTask', this._id, text);
            //close the modal
            $('.modal').modal('hide');
        }
    })
    
    
    //configure accounts
    Accounts.ui.config({
        passwordSignupFields: "USERNAME_ONLY"
    })