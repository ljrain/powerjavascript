// this file requires the instance to work.

function trackForm(Formname)
{
    this.appInsights.trackMetric({name:Formname, average: 105, value:83});
    this.appInsights.trackEvent({name:Formname, properties: 
    { // accepts any type
      prop1: 'string',
      prop2: 123.45,
      prop3: { nested: 'objects are okay too' }
    }});
    this.appInsights.flush();
}

function whatEvent(executionContext)
{
    var eventSrcName;
    if (executionContext != null) {
            formContext = executionContext.getFormContext();
            eventSrc = executionContext.getEventSource();
        }
 
        // identify the event source
        if (eventSrc.tabs) {
            eventSrcName = "ONLOAD";
        }
        else
        {
            // event source is a form, this is the "onload" event (tabs) or an onChange event from lgp_programid
            // assign event handlers to all controls in the step set
            eventSourceName = eventSrc.getName();
//            for (var i = 0; i < count; i++) {
//                // xxx
//            }
        }
    return(eventSrc);
}

function trackMetric(executionContext,nameValue,metricValue)
{
  var formContext = executionContext.getFormContext();
  this.appInsights.trackMetric({name:nameValue, value:metricValue});
  this.appInsights.flush();
}

function trackEvent(executionContext, nameValue, propertiesDict)
{
  var formContext = executionContext.getFormContext();
  var eventName = whatEvent(executionContext);
  if (eventName != null)
      this.appInsights.trackEvent({name:eventName, properties:propertiesDict})
    else
      this.appInsights.trackEvent({name:namevalue, properties:propertiesDict})
    
  this.appInsights.flush();
}
