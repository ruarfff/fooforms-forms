/*jslint node: true */
/*global describe, it, before, beforeEach, after, afterEach */
'use strict';

var should = require('should');
var assert = require('assert');
var mongoose = require('mongoose');
var ObjectId = mongoose.Types.ObjectId();
// Nasty hack for testing with mocha -w ... see: https://github.com/LearnBoost/mongoose/issues/1251
mongoose.models = {};
mongoose.modelSchemas = {};

var mockgoose = require('mockgoose');
mockgoose(mongoose);

var Form = require('../models/form');

describe('Form', function () {
    // Happy path
    describe('initializing a form with default values', function () {
        var form = {};

        var displayName = 'form';

        before(function (done) {
            mockgoose.reset();
            var testForm = new Form({displayName: displayName});
            testForm.save(function (err, savedForm) {
                form = savedForm;
                done(err);
            });
        });

        it('has the displayName: ' + displayName, function () {
            form.displayName.should.equal(displayName);
        });
        it('has no title', function () {
            should.not.exist(form.title);
        });
        it('has no icon', function () {
            should.not.exist(form.icon);
        });
        it('has no description', function () {
            should.not.exist(form.description);
        });
        it('has no button label', function () {
            should.not.exist(form.btnLabel);
        });
        it('has not settings', function () {
            should.not.exist(form.settings);
        });
        it('has no fields', function () {
            form.fields.length.should.equal(0);
        });
        it('has no stream', function () {
            should.not.exist(form.stream);
        });
        it('version is 1', function () {
            form.version.should.equal(1);
        });
        it('has a create date', function () {
            should.exist(form.created);
            form.created.should.be.instanceof(Date);
        });
        it('has a last modified date', function () {
            should.exist(form.lastModified);
            form.lastModified.should.be.instanceof(Date);
        });
        it('has a url', function () {
            should.exist(form.url);
        });

    });

    describe('initializing with some realistic values', function () {
        var form = {};

        var displayName = 'form';
        var title = 'form title';
        var icon = 'www.fooforms.com/icon.png';
        var description = 'the form description';
        var btnLabel = 'the button label';
        var settings = {
            "setting": {},
            "something": [],
            "something-else": "test"
        };
        var fields = [
            {},
            {},
            {}
        ];
        var postStream = ObjectId;

        before(function (done) {
            mockgoose.reset();
            var testForm = new Form({
                displayName: displayName, title: title, icon: icon,
                description: description, btnLabel: btnLabel,
                settings: settings, fields: fields,
                postStream: postStream
            });
            testForm.save(function (err, savedForm) {
                form = savedForm;
                done(err);
            });
        });
        it('has the display name: ' + displayName, function () {
            form.displayName.should.equal(displayName);
        });
        it('has the title: ' + title, function () {
            form.title.should.equal(title);
        });
        it('has the icon: ' + icon, function () {
            form.icon.should.equal(icon);
        });
        it('has the description: ' + description, function () {
            form.description.should.equal(description);
        });
        it('has the button label: ' + btnLabel, function () {
            form.btnLabel.should.equal(btnLabel);
        });
        it('has the settings: ' + JSON.stringify(settings), function () {
            form.settings.should.equal(settings);
        });
        it('has the fields: ' + JSON.stringify(fields), function () {
            form.fields.length.should.equal(fields.length);
            var i;
            for (i = 0; i < form.fields.length; i++) {
                form.fields[i].should.equal(fields[i]);
            }
        });
        it('has the postStream: ' + postStream, function () {
            form.postStream.length.should.equal(1);
            form.postStream[0].should.equal(postStream);
        });
        it('version is 1', function () {
            form.version.should.equal(1);
        });
        it('has a url', function () {
            should.exist(form.url);
        });
        it('has a create date', function () {
            should.exist(form.created);
            form.created.should.be.instanceof(Date);
        });
        it('has a last modified date', function () {
            should.exist(form.lastModified);
            form.lastModified.should.be.instanceof(Date);
        });
        it('has a url', function () {
            should.exist(form.url);
        });
    });
    describe('version gets incremented on save', function () {
        var form = {};

        var displayName = 'form';

        before(function (done) {
            mockgoose.reset();
            var testForm = new Form({displayName: displayName});
            testForm.save(function (err, savedForm) {
                form = savedForm;
                done(err);
            });
        });

        it('should have the version number 2 after being updated once', function (done) {
            form.save(function (err, savedForm) {
                should.exist(savedForm);
                savedForm.version.should.equal(2);
                done(err);
            });
        });

        it('should have the version number 3 after being updated twice', function (done) {
            form.save(function (err, savedForm) {
                should.exist(savedForm);
                savedForm.version.should.equal(3);
                done(err);
            });
        });
    });
    describe('saving with bad values', function () {
        beforeEach(function () {
            mockgoose.reset();
        });
        it('does not save if displayName is omitted', function (done) {
            var testForm = new Form();
            testForm.save(function (err, form) {
                should.exist(err);
                should.exist(err.errors.displayName);
                err.name.should.equal('ValidationError');
                should.not.exist(form);
                done();
            });
        });
    });
});