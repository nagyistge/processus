
var processus = require('../engine/processus');
var store = require('../engine/persistence/store');

/* Workflow Handler
 * using the parameter data.file, this handler will attempt to load the corresponding file
 * execute it and save the resulting workflow output in data.workflow.
 * as with the CLI add data.id to update an existing workflow
 */
module.exports = function(workflowId, taskName, task, callback, logger){

  var err;
  if(!task.data) {
    callback(new Error("Task [" + taskName + "] has no data property!"), task);
    return;
  }

  //Validate that the data cmd property has been set
  if(!task.data.file) {
    callback(new Error("Task [" + taskName + "] has no data.file property set!"), task);
    return;
  }

  var workflowTaskJSON;
  store.loadDef(task.data.file, function(err, workflowFile){
    if(!err){
      workflowTaskJSON = workflowFile;
    }
    else {
      callback(err, null);
    }
  });
  if(workflowTaskJSON === undefined){
    return;
  }

  processus.runWorkflow(task.data.file, task.data.id, workflowTaskJSON, function(err, workflow){
    task.data.workflow = workflow;
    callback(err, task);
  });


};
