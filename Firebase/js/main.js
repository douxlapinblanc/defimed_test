requirejs.config({
    baseUrl: 'js',
    paths: {
        jquery: 'lib/jquery',
		jqueryui: 'lib/jqueryui',
        progressbar: 'lib/progressbar'
	}
});
///////////////////////////////////////////////////////////////////////////


require([
    'app',
    'patient.1',
    'patient.2',
	'patient.3',
	'patient.4',
	'jqueryui'
], function(app, p1,p2,p3,p4,jqueryui) {
    //app.registerPatient(p4);
    //app.registerPatient(p2);
	app.registerPatient(p1);
	app.registerPatient(p2);
    app.init();
});