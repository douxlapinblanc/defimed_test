requirejs.config({
    baseUrl: 'js',
    paths: {
        jquery: 'lib/jquery-3.1.1.min',
        progressbar: 'lib/progressbar'
    }
});

require([
    'app',
    'patient.1',
    'patient.2',
	'patient.3',
], function(app, p1, p2,p3) {
    app.registerPatient(p1);
    app.registerPatient(p2);
	app.registerPatient(p3);
    app.init();
});