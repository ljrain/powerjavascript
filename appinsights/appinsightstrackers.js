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

function trackMetric(executionContext,nameValue,metricValue)
{
  var formContext = executionContext.getFormContext();
  this.appInsights.trackMetric({name:nameValue, value:metricValue});
  this.appInsights.flush();
}

function trackEvent(executionContext, nameValue, propertiesDict)
{
  var formContext = executionContext.getFormContext();
  this.appInsights.trackEvent({name:nameValue, properties:propertiesDict})
  this.appInsights.flush();
}
