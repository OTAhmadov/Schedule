var eventDateGlobal;
var GlobalmeetingStartDate;
var GlobalmeetingEndDate ;
var curEv=[];
var submitedEvents = [];
var Schedule = {
    token: 'ab3aba49e47d48c3b4783f2a609eb51222645ed1767a4599bc961d58d6098a7e',
    lang: 'az',
    appId: 1000009,
    currModule: '',
    operationList: [],
    subOperationList: [],
    array: [],
    node: [],
    structureId: '',
    subModuleId: [],
    personId: 0,
    button: '',
    dicTypeId: 0,
    tempDataId: '',
    eventDateGlobal:'',
    GlobalmeetingStartDate:'',
    GlobalmeetingEndDate:'',
    curEv:[],

    urls: {
//      ROS: "http://localhost:8080/ROS/",
        ROS: "http://192.168.1.78:8082/ROS/",
//      AdminRest: 'http://localhost:8080/AdministrationRest/',
        AdminRest: 'http://192.168.1.78:8082/AdministrationRest/',
//      HSIS: "http://localhost:8080/UnibookHsisRest/",
        HSIS: "http://192.168.1.78:8082/UnibookHsisRest/",
//        REPORT: 'http://localhost:8080/ReportingRest/',
        REPORT: 'http://192.168.1.78:8082/ReportingRest/',
//        EMS: 'http://localhost:8080/UnibookEMS/'
        EMS: 'http://192.168.1.78:8082/UnibookEMS/'
    },
    statusCodes: {
        OK: 'OK',
        UNAUTHORIZED: 'UNAUTHORIZED',
        ERROR: 'ERROR',
        INVALID_PARAMS: 'INVALID_PARAMS'
    },
    REGEX: {
        email: /\S+@\S+\.\S+/,
        number: /^\d+$/,
        decimalNumber: /^\d+(\.\d+)?$/,
        TEXT: 'text\/plain',
        PDF: 'application\/pdf',
        XLS: 'application\/vnd\.ms-excel',
        XLSX: 'application\/vnd\.openxmlformats-officedocument\.spreadsheetml\.sheet',
        DOC: 'application\/vnd\.openxmlformats-officedocument\.wordprocessingml\.document',
        DOCX: 'application\/msword',
        phone: /\(\+\d{3}\)-\d{2}-\d{3}-\d{2}-\d{2}/,
        IMAGE_EXPRESSION: 'image\/jpeg|image\/png',
    },
    MASK: {
        phone: '(+000)-00-000-00-00'
    },
    initToken: function (cname) {
        var name = cname + "=";

        if (document.cookie == name + null || document.cookie == "") {
            window.location.href = '/Schedule/greeting.html'
        }

        else {
            var ca = document.cookie.split(';');
            for (var i = 0; i < ca.length; i++) {
                var c = ca[i];

                while (c.charAt(0) == ' ') {
                    c = c.substring(1);
                }

                if (c.indexOf(name) == 0) {
                    Schedule.token = c.substring(name.length, c.length);
                }
            }
        }

    },
    initLanguageCookie: function (name) {
        var ca = document.cookie.split(';');

        for (var i = 0; i < ca.length; i++) {
            var c = ca[i];

            while (c.charAt(0) == ' ') {
                c = c.substring(1);
            }

            if (c.indexOf(name) == 0) {
                Schedule.lang = c.substring(name.length, c.length).split('=')[1];
            }
        }

        if (Schedule.lang.trim().length === 0) {
            Schedule.lang = 'az';
        }
    },
    initCurrentModule: function (name) {
        var ca = document.cookie.split(';');
        for (var i = 0; i < ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0) == ' ') {
                c = c.substring(1);
            }
            if (c.indexOf(name) == 0) {
                var currModule = c.substring(name.length, c.length).split('=')[1];
                return currModule;
            }
        }
        return "";
    },
    loadLanguagePack: function (lang) {
        $.getJSON('js/i18n/' + lang + '.json', function (data) {
            $.each(data, function (i, v) {
                Schedule.dictionary[lang][i] = v;
            });
        });
    },
    i18n: function () {
        Schedule.initLanguageCookie('lang');
        var attr = '';

        $('[data-i18n]').each(function () {
            attr = $(this).attr('data-i18n');
            $(this).text(Schedule.dictionary[Schedule.lang][attr]);
            $(this).attr('placeholder', Schedule.dictionary[Schedule.lang][attr]);
        });
    },
    getCookie: function (cookie_name) {

        var results = document.cookie.match('(^|;) ?' + cookie_name + '=([^;]*)(;|$)');

        if (results)
            return (decodeURI(results[2]));
        else
            return null;

    },
    dictionary: {
        az: {},
        en: {},
        ru: {}
    },
    Parsers: {
//        parseApplicationsList:  function (data) {
//            var html = '';
//            if (data) {
//                $.each(data, function (i, v) {
//                    html += '<li data-toggle="tooltip" data-placement="bottom" title = "' + v.name['az'] + '">' + '<a data-id="' + v.id + '"  href="' + v.url + '?token=' + Schedule.token + '">' + v.shortName['az'] +'</a>' +'</li>';
//                });
//                $('.app-con').html(html);
//            }
//
//        },

        parseApplicationsList: function (data) {
            var html = '';
            if (data) {
                $.each(data, function (i, v) {
                    
                        html += '<li data-toggle="tooltip" data-placement="bottom" title = "' + v.name[Schedule.lang] + '">' + 
                                    '<a data-id="' + v.id + '"  href="' + v.url + '?token=' + Schedule.token + '">' + v.shortName[Schedule.lang] + '</a>' + 
                                '</li>';
                });
                
                    
                    $('.app-con').html(html);
                    $('.app-con a[data-id="' + Schedule.appId + '"]').parent('li').addClass('active');
                    $('[data-toggle="tooltip"]').tooltip();

                    var moduleListItems = $('body').find('.app-con li');
                    console.log(moduleListItems)
                    if(moduleListItems.length>5){
                        $('body').find('div.app-list, .hide-menu').addClass('less-menu')
                    }else{
                        $('body').find('div.app-list, .hide-menu').removeClass('less-menu')
                    }

                
            }

        },
        parseDictionaryStudyType:  function (data) {
            var html = '<option value="0">Seçin</option>';
            if (data) {
                $.each(data, function (i, v) {
                    html += '<option parent="' + v.parentId + '" code="' + v.code + '" value="' + v.id + '">' + v.value['az'] + '</option>';
                });

            }
            $('#study-type, #study-type-view').html(html);
        },
        parseDictionaryStudyLang:  function (data) {
            var html = '<option value="0">Seçin</option>';
            if (data) {
                $.each(data, function (i, v) {
                    html += '<option parent="' + v.parentId + '" code="' + v.code + '" value="' + v.id + '">' + v.value['az'] + '</option>';
                });

            }
            $('#study-lang, #study-lang-view').html(html);
        },
        parseDictionarySemestr:  function (data) {
            var html = '<option value="0">Seçin</option>';
            if (data) {
                $.each(data, function (i, v) {
                    html += '<option parent="' + v.parentId + '" code="' + v.code + '" value="' + v.id + '">' + v.value['az'] + '</option>';
                });

            }
            $('#study-semestr, #study-semestr-view').html(html);
        },
        parseDictionaryCourses:  function (data) {
            var html = '<option value="0">Seçin</option>';
            if (data) {
                $.each(data, function (i, v) {
                    html += '<option parent="' + v.parentId + '" code="' + v.code + '" value="' + v.id + '" data-status="'+ v.courseMeetingStatus +'">' + v.eduPlanSubject.value['az'] + '</option>';
                });

            }
            $('#courses, #courses-view').html(html);
        },
        parseDictionaryClock:  function (data) {
            var html = '<option value="0">Seçin</option>';
            if (data) {
                $.each(data, function (i, v) {
                    html += '<option parent="' + v.parentId + '"  value="' + v.id + '">' + v.startTime + '-' + v.endTime + '</option>';
                });

            }
            $('#clock').html(html);
        },
        parseDictionaryRoom:  function (data) {
            var html = '<option value="0">Seçin</option>';
            if (data) {
                $.each(data, function (i, v) {
                    html += '<option parent="' + v.parentId + '" code="' + v.code + '" value="' + v.id + '">' + v.name + '</option>';
                });

            }
            $('#rooms').html(html);
        },
        parseDictionaryTeacher:  function (data) {
            var html = '<option value="0">Seçin</option>';
            if (data) {
                $.each(data, function (i, v) {
                    html += '<option parent="' + v.parentId + '" code="' + v.code + '" value="' + v.id + '">' + v.fullname + '</option>';
                });

            }
            $('#teachers').html(html);
        },
        parseMeetings:  function (data) {

            var html = '';
            if (data) {
                $.each(data, function (i, v) {
                    html += '<li class="fc-event" data-className="color-1"  data-id="' + v.id + '" data-eventObject="'+  v.subject.value['az'] +'" >' + v.subject.value['az'] + '</li>';
                });

            }
            $('#eventsToAdd').html(html);
        },
        parseOrgTree: function (tree) {
            try {
                Schedule.array = [];
                var array = [];
                if (tree.length > 0) {
                    $.each(tree, function (i, v) {

                        var obj = {
                            id: v.id.toString(),
                            dicType: v.type.id,
                            parent: (v.parent.id) == 0 ? "#" : v.parent.id.toString(),
                            text: v.name[Schedule.lang],
                            about: v.about[Schedule.lang],
                            li_attr: {
                                'data-img': tree[i].iconPath,
                                'title': tree[i].type.value[Schedule.lang],
                                'class': 'show-tooltip'
                            },
                        };


                        array.push(obj);
                        Schedule.array.push(obj);
                    });

                    $('body').find('#jstree').jstree('refresh').jstree({
                        "core": {
                            "data": array,
                            "check_callback": true,
//                            'strings': {
//                                'Loading ...': 'Please wait ...'
//                            },
                            "themes": {
                                "variant": "large",
                                "dots": false,
                                "icons": true
                            }
                        },
                        "search": {
                            "case_insensitive": true,
                            "show_only_matches": true
                        },
                        "plugins": ["wholerow", "search", "crrm"]
                    }).on('loaded.jstree', function () {
                        $('#jstree').jstree('open_all');
                        $('.tree-preloader').remove();

                    })
                }
                else {
                    $('body').find('#jstree').jstree("destroy");
                }


            }
            catch (err) {
                console.error(err);
            }
        },
        commonParseTree: function (data, objectId) {
            try {
                var array = [];
                if (data.length > 0) {

                    $.each(data, function (i, v) {
                        var obj = {
                            id: v.id.toString(),
                            parent: (v.parent.id == 0) ? "#" : v.parent.id.toString(), text: v.name[Schedule.lang],
                            typeId: v.type.id

                        };
                        array.push(obj);
                        Schedule.array.push(obj);
                    });
                    $('body').find('#' + objectId).on('loaded.jstree', function (e, data) {
                        $('.tree-preloader').remove();
                        $('#' + objectId).removeAttr('data-id');
                        $('#' + objectId).removeAttr('check');

                    })
                            .jstree({
                                "core": {
                                    "data": array,
                                    "check_callback": true,
                                    "themes": {
                                        "variant": "large",
                                        "dots": false,
                                        "icons": true
                                    },
                                },
                                "search": {
                                    "case_insensitive": true,
                                    "show_only_matches": true
                                },
                                "plugins": ["wholerow", "search"],
                                "themes": {"stripes": true}
                            });
                }
                else {
                    $('body').find('#' + objectId).jstree("destroy");
                }
            }
            catch (err) {
                console.error(err);
            }
        },
    },
    Loads: {
        loadApplications: function () {
            $.ajax({
                url: Schedule.urls.ROS + 'applications?token=' + Schedule.token,
                type: 'GET',
                success: function (data) {
                   
                        if (data) {
                        Schedule.Parsers.parseApplicationsList(data.data);
                        $('[data-toggle="tooltip"]').tooltip();
                        }
                 
            
                }
            });
        },
        
        loadSubApplications: function (callback) {
            $.ajax({
                url: Schedule.urls.ROS + 'applications/1000014/subApplications?token=' + Schedule.token,
                type: 'GET',
//                headers: {
//                    'Token': Hsis.token
//                },
                success: function (data) {
                    try {
                        if (data) {
                            switch (data.code) {
                                case Schedule.statusCodes.OK:
                                    if(callback)
                                        callback(data);
                                    break;

                                case Schedule.statusCodes.ERROR:
                                    break;

                                case Schedule.statusCodes.UNAUTHORIZED:
                                    window.location = Schedule.urls.ROS + 'unauthorized';
                                    break;
                            }
                        }
                    }
                    catch (err) {
                        console.error(err);
                    }
                }
            });
        },
        
        getProfile: function () {
            $.ajax({
                url: Schedule.urls.ROS + "profile?token=" + Schedule.token,
                type: 'GET',
                success: function (data) {
                    if (data) {
                        switch (data.code) {
                            case Schedule.statusCodes.ERROR:
                                $.notify(Schedule.dictionary[Schedule.lang]['error'], {
                                    type: 'danger'
                                });
                                break;

                            case Schedule.statusCodes.OK:
                                try {
                                    if (data.data) {
//                                        var user = data.data;
//                                        $('.profile-data li[data-type="name"]').text(user.person.name + ' ' + user.person.surname + ' ' + user.person.patronymic);
//                                        $('.profile-data li[data-type="role"]').text(user.role.value[Schedule.lang]);
//                                        $('.profile-data li[data-type="org"]').text(user.structure.name[Schedule.lang]);
//                                        $('.logo-name').text(user.orgName.value[Schedule.lang]);
//                                        $('.main-img').attr('src', Schedule.urls.AdminRest + 'users/' + user.id + '/image?token=' + Schedule.token);
//                                        $('.org-logo').attr('src', Schedule.urls.HSIS + 'structures/' + user.orgName.id + '/logo?token=' + Schedule.token);
//                                        var img = $('.main-img');
//                                        img.on('error', function (e) {
//                                            $('.main-img').attr('src', 'assets/img/guest.png');
//                                        })
//                                        $('div.big-img img').attr('src', Schedule.urls.AdminRest + 'users/' + user.id + '/image?token=' + Schedule.token);
//                                        $('div.big-img img').on('error', function (e) {
//                                            $('div.big-img img').attr('src', 'assets/img/guest.png');
//                                        });
//                                        Schedule.structureId = user.structure.id;
                                    }
                                }
                                catch (err) {
                                    console.error(err);
                                }
                                break;

                            case Schedule.statusCodes.UNAUTHORIZED:
                                window.location = Schedule.urls.ROS + 'unauthorized';
                                break;
                        }
                    }
                }
            })
        },
        loadOperations: function (moduleId) {
            $.ajax({
                url: Schedule.urls.ROS + 'applications/modules/'+moduleId+'/operations?token=' + Schedule.token,
                type: 'GET',
                success: function (data) {
                    Schedule.operationList = data;
                    console.log(Schedule.operationList);
                }
            });
        },

        removeCourseCopy: function(t,courseId) {
            $(t).parents("div.removeCopyButton").hide();
            $.ajax({
                url: Schedule.urls.EMS + 'course/'+courseId+'/schedule/copy/remove?token=' + Schedule.token,
                type: 'POST',
                success: function (data) {
                    $("#courses").trigger("change");
                    $(t).parents("div.removeCopyButton").hide();
                }
            });
        },
        
        loadFilterStudyType: function () {
            $.ajax({
                url: Schedule.urls.AdminRest + 'settings/dictionaries?typeId=1000017&parentId=0&token=' + Schedule.token,
                type: 'GET',
                success: function (data) {
                   
                        if (data) {
                        Schedule.Parsers.parseDictionaryStudyType(data.data);
                       
                        }
                 
            
                }
            });
        },
        loadFilterStudyLang: function () {
            $.ajax({
                url: Schedule.urls.AdminRest + 'settings/dictionaries?typeId=1000027&parentId=0&token=' + Schedule.token,
                type: 'GET',
                success: function (data) {
                   
                        if (data) {
                        Schedule.Parsers.parseDictionaryStudyLang(data.data);
                       
                        }
                 
            
                }
            });
        },
        loadFilterSemestr: function () {
            $.ajax({
                url: Schedule.urls.AdminRest + 'settings/dictionaries?typeId=1000062&parentId=0&token=' + Schedule.token,
                type: 'GET',
                success: function (data) {
                   
                        if (data) {
                        Schedule.Parsers.parseDictionarySemestr(data.data);
                       
                        }
                 
            
                }
            });
        },
        loadFilterCourses: function (params) {
            $.ajax({
                url: Schedule.urls.EMS + 'course?'+ params +'&statusId=1000340&token=' + Schedule.token,
                type: 'GET',
                success: function (data) {
                   
                        if (data) {
                        Schedule.Parsers.parseDictionaryCourses(data.data);
               
                        }
                 
            
                }
            });
        },
        loadFilterClock: function (callback) {
            $.ajax({
                url: Schedule.urls.EMS + 'schedule/clocks?orgId=0&token=' + Schedule.token,
                type: 'GET',
                success: function (data) {
                   
                        if (data) {
                        Schedule.Parsers.parseDictionaryClock(data.data);
                       
                        }
                 
            
                },
                error: function(msg){
                     
                },
                complete: function(){
                    callback();
                }
            });
        },
        loadFilterRoom: function (callback) {
            var id = $('body').attr('data-meeting-id');
            $.ajax({
                url: Schedule.urls.EMS + 'schedule/rooms?courseMeetingId='+ id +'&token=' + Schedule.token,
                type: 'GET',
                success: function (data) {
                   
                        if (data) {
                        Schedule.Parsers.parseDictionaryRoom(data.data);
                       
                        }
                 
            
                },
                complete: function(){
                    callback();
                }
            });
        },
        loadFilterTeacher: function (callback) {
            var id = $('body').attr('data-meeting-id');
            $.ajax({
                url: Schedule.urls.EMS + 'schedule/teachers?courseMeetingId='+ id +'&token=' + Schedule.token,
                type: 'GET',
                success: function (data) {
                   
                        if (data) {
                        Schedule.Parsers.parseDictionaryTeacher(data.data);
                       
                        }
                 
            
                },
                complete: function(){
                    callback();
                }
            });
        },
        loadMeetings: function (id, courseStatus) {

            $.ajax({
                url: Schedule.urls.EMS + 'schedule/courseMeetings?courseId=' + id + '&token=' + Schedule.token,
                type: 'GET',
                success: function (data) {
                   
                        if (data) {
                            if(data.data.length > 0){
                               Schedule.Parsers.parseMeetings(data.data); 
                               $('body').find('.submit-events').remove();
                               console.log(data.data)
                            }else{
                                Schedule.Parsers.parseMeetings(data.data); 
                                Schedule.Loads.loadCourseEvents();
                                
                                 
                                $('body').find('.submit-events').remove();
                                if(courseStatus == 1000341){
                                    $('body').find('.submit-events').remove();
                                    $('#schedule_submit').fadeIn(1);
                                    //  
                                  

                                }else{
                                    
                                    $('#schedule_submit').fadeOut(1);
                                    
                                    $('#eventsToAdd+.text-center').append('<p class="submit-events">Təsdiqlənib!</p>')
                                    //  
                                    
                                }
                            }
                                                 
                        }
                 
                },
                complete: function(){
                    $('body #eventsToAdd').find('.fc-event').each(function() {

                        // store data so the calendar knows to render an event upon drop
                        $(this).data('event', {
                            title: $.trim($(this).text()), // use the element's text as the event title
                            stick: true // maintain when user navigates (see docs on the renderEvent method)
                        });

                        // make the event draggable using jQuery UI
                        $(this).draggable({
                            zIndex: 999,
                            revert: true,      // will cause the event to go back to its
                            helper: 'clone',
                            containment: "#main",
                            scroll: false,
                            appendTo: 'body',
                            revertDuration: 0,
                            start: function( event, ui ) {
                                     $('#sidebar .sidebar-inner').addClass('second-v');
                                     $(this).hide();   
                                } ,
                            stop: function(){
                                $('#sidebar .sidebar-inner').removeClass('second-v');
                                 $(this).show();
                            }
                        });

                        

                    });
                }
            });
        },
        editEvents: function (eventEndGlobal, eventDateStartGlobal, form, callback) {
            var id = $('body').attr('data-meeting-id');
            $.ajax({
                url: Schedule.urls.EMS + 'schedule/' + id + '/edit?token=' + Schedule.token,
                type: 'POST',
                data: form,
                success: function (data) {

                    if (data) {
                        switch (data.code) {
                            case Schedule.statusCodes.ERROR:
                                $('#addNew-event .modal-body p.error-label').remove();
                                $('#addNew-event .modal-body').append('<p class="error-label">'+ data.message[Schedule.lang] +'</p>');
                                $.notify(Schedule.dictionary[Schedule.lang]['lesson_error'], {
                                    type: 'danger'
                                });
                                $('body').removeClass('notify-open-drop');
                                $.ajax({
                                    url: Schedule.urls.EMS + 'schedule?meetingStartDate='+ eventDateStartGlobal +'&meetingEndDate='+ eventDateEndGlobal +'&token=' + Schedule.token,
                                    type: 'GET',
                                    dataType: 'JSON',
                                    success: function(doc) {
                                        var events = [];
                                        $(doc.data).each(function(i, v) {
                                            events.push({
                                                code: v.course.code,
                                                teacher: v.teacherName,
                                                title: v.title,
                                                clock: v.time.substring(0, 5),
                                                lessonType: v.lessonType.substring(0, 1),
                                                start: v.start,
                                                room: v.roomName,
                                                eventId: v.id,
                                                status: v.status.id
                                            });
                                        });


                                        // callback(events);

                                   
                                       $('#calendar').fullCalendar( 'removeEvents');
                                       $('#calendar').fullCalendar('removeEventSources');
                                       $('#calendar').fullCalendar( 'addEventSource', events);

                                         
                                    }
                                });

                                break;

                            case Schedule.statusCodes.OK:

                                $.ajax({
                                    url: Schedule.urls.EMS + 'schedule?meetingStartDate='+ eventDateStartGlobal +'&meetingEndDate='+ eventDateEndGlobal +'&token=' + Schedule.token,
                                    type: 'GET',
                                    dataType: 'JSON',
                                    success: function(doc) {
                                        var events = [];
                                        $(doc.data).each(function(i, v) {
                                            events.push({
                                                code: v.course.code,
                                                teacher: v.teacherName,
                                                title: v.title,
                                                clock: v.time.substring(0, 5),
                                                lessonType: v.lessonType.substring(0, 1),
                                                start: v.start,
                                                room: v.roomName,
                                                eventId: v.id,
                                                status: v.status.id
                                            });
                                        });

                                         

                                        // callback(events);
                                        $.notify(Schedule.dictionary[Schedule.lang]['success'], {
                                            type: 'success'
                                        });
                                        $('body').removeClass('notify-open-drop');
                                   
                                       $('#calendar').fullCalendar( 'removeEvents');
                                       $('#calendar').fullCalendar('removeEventSources');
                                       $('#calendar').fullCalendar( 'addEventSource', events);

                                         
                                    }
                                });
                                // var params = $('#course-filter-form').serialize();
                                Schedule.Loads.loadMeetings($('#courses').val(), $('#courses').find('option:selected').attr('data-status'));
                                // Schedule.Loads.loadEditEvents();
                                $('#addNew-event .modal-body p.error-label').remove();
                                $('#addNew-event form')[0].reset()
                                $('#addNew-event').modal('hide');
                                
                                $('body').find('li[data-id="'+ $('body').attr('data-event-id') +'"]').remove();
                                break;

                            case Schedule.statusCodes.UNAUTHORIZED:
                                window.location = Schedule.urls.ROS + 'unauthorized';
                                break;

                        }

                    }

                  
            
                }
            });
        },
        loadEvents: function(){
            $.ajax({
                url: Schedule.urls.EMS + 'schedule?token=' + Schedule.token,
                dataType: 'JSON',
                type: 'GET',
                data: {
                    meetingStartDate: moment($('#calendar').fullCalendar('getView').start).format("YYYY-MM-DD"),
                    meetingEndDate: moment($('#calendar').fullCalendar('getView').end).format("YYYY-MM-DD"),
                    eduLangId: $('#study-lang-view').val(),
                    eduTypeId: $('#study-type-view').val(),
                    semestrId: $('#study-semestr-view').val(),
                    orgId: $('#orgId').val(),
                    courseId: $('#courses-view').val()
                },
                success: function(doc) {
                    var events = [];
                    $(doc.data).each(function(i, v) {
                        events.push({
                            code: v.course.code,
                            teacher: v.teacherName,
                            title: v.title,
                            clock: v.time.substring(0, 5),
                            lessonType: v.lessonType.substring(0, 1),
                            lessonTypeFull: v.lessonType,
                            start: v.start,
                            room: v.roomName,
                            eventId: v.id,
                            status: v.status.id
                        });
                    });

                     
                    // callback(events);
                    $('#calendar').fullCalendar( 'removeEvents');
                    $('#calendar').fullCalendar('removeEventSources');
                    $('#calendar').fullCalendar( 'addEventSource', events);
                    // $('#calendar').fullCalendar( 'refetchEvents');
                }
            });
        },
        loadEditEvents: function(){
            $.ajax({
                url: Schedule.urls.EMS + 'schedule?token=' + Schedule.token,
                dataType: 'JSON',
                type: 'GET',
                data: {
                    meetingStartDate: moment($('#calendar').fullCalendar('getView').start).format("YYYY-MM-DD"),
                    meetingEndDate: moment($('#calendar').fullCalendar('getView').end).format("YYYY-MM-DD"),
                    eduLangId: $('#study-lang').val(),
                    eduTypeId: $('#study-type').val(),
                    semestrId: $('#study-semestr').val(),
                    orgId: $('#orgId').val()
                    // courseId: $('#courses').val()
                },
                success: function(doc) {
                    var events = [];
                    $(doc.data).each(function(i, v) {
                        events.push({
                            code: v.course.code,
                            teacher: v.teacherName,
                            title: v.title,
                            clock: v.time.substring(0, 5),
                            lessonType: v.lessonType.substring(0, 1),
                            lessonTypeFull: v.lessonType,
                            start: v.start,
                            room: v.roomName,
                            eventId: v.id,
                            status: v.status.id
                        });
                    });

                     
                    // callback(events);
                    $('#calendar').fullCalendar( 'removeEvents');
                    $('#calendar').fullCalendar('removeEventSources');
                    $('#calendar').fullCalendar( 'addEventSource', events);
                    // $('#calendar').fullCalendar( 'refetchEvents');
                }
            });
        },
        loadCourseEvents: function(){
            $.ajax({
                url: Schedule.urls.EMS + 'schedule?token=' + Schedule.token,
                dataType: 'JSON',
                type: 'GET',
                data: {
                    meetingStartDate: moment($('#calendar').fullCalendar('getView').start).format("YYYY-MM-DD"),
                    meetingEndDate: moment($('#calendar').fullCalendar('getView').end).format("YYYY-MM-DD"),
                    eduLangId: $('#study-lang').val(),
                    eduTypeId: $('#study-type').val(),
                    semestrId: $('#study-semestr').val(),
                    orgId: $('#orgId').val(),
                    courseId: $('#courses').val()
                },
                success: function(doc) {
                    submitedEvents = [];
                    $(doc.data).each(function(i, v) {
                        if(v.status.id == 1000340){
                            submitedEvents.push({
                                eventId: v.id

                            });
                        }
                    });

                   
                    

                }
            });
        },
        reLoadEvents: function(){
            $.ajax({
                url: Schedule.urls.EMS + 'schedule?token=' + Schedule.token,
                dataType: 'JSON',
                type: 'GET',
                data:{
                    meetingStartDate: moment($('#calendar').fullCalendar('getView').start).format("YYYY-MM-DD"),
                    meetingEndDate: moment($('#calendar').fullCalendar('getView').end).format("YYYY-MM-DD"),
                },
                success: function(doc) {
                    var events = [];
                    $(doc.data).each(function(i, v) {
                        events.push({
                            code: v.course.code,
                            teacher: v.teacherName,
                            title: v.title,
                            clock: v.time.substring(0, 5),
                            lessonType: v.lessonType.substring(0, 1),
                            lessonTypeFull: v.lessonType,
                            start: v.start,
                            room: v.roomName,
                            eventId: v.id,
                            status: v.status.id
                        });
                    });

                    // callback(events);
                    $('#calendar').fullCalendar( 'removeEvents');
                    $('#calendar').fullCalendar('removeEventSources');
                    $('#calendar').fullCalendar( 'addEventSource', events);
                    // $('#calendar').fullCalendar( 'refetchEvents');
                }
            });
        },
        removeEvents: function () {
            var id = $('body').attr('data-meeting-id');
            $.ajax({
                url: Schedule.urls.EMS + 'schedule/' + id + '/remove?token=' + Schedule.token,
                type: 'POST',
                success: function (data) {
                    try {
                        if (data) {
                            switch (data.code) {
                                case Schedule.statusCodes.OK:
                                    Schedule.Loads.loadEditEvents();
                                    Schedule.Loads.loadMeetings($('#courses').val());
                                    $.notify(Schedule.dictionary[Schedule.lang]['success'], {
                                        type: 'success'
                                    });
                                    $('#schedule_submit').fadeOut(1);
                                    break;

                                case Schedule.statusCodes.ERROR:
                                    $.notify(Schedule.dictionary[Schedule.lang]['error'], {
                                        type: 'danger'
                                    });
                                    break;

                                case Schedule.statusCodes.UNAUTHORIZED:
                                    window.location = Caremed.urls.CaremedLogin + 'login?app=' + Caremed.appId;
                                    break;
                            }
                        }
                    } catch (err) {
                        console.error(err);
                    }

                }
            });
        },
        submitEvents: function () {
            var courseId = $('#courses').val();
            var selectedCourse = $('#courses').find('option:selected');
            
            $.ajax({
                url: Schedule.urls.EMS + 'schedule/confirm?token=' + Schedule.token,
                type: 'POST',
                data:{
                    id: courseId
                },
                success: function (data) {

                    try {
                        if (data) {
                            switch (data.code) {
                                case Schedule.statusCodes.OK:
                                   Schedule.Loads.loadEditEvents();
                                   Schedule.Loads.loadCourseEvents();
                                   Schedule.Loads.loadMeetings($('#courses').val());
                                   $.notify(Schedule.dictionary[Schedule.lang]['success'], {
                                       type: 'success'
                                   });
                                   selectedCourse.attr('data-status', '1000340')
                                    break;

                                case Schedule.statusCodes.ERROR:
                                    $.notify(Schedule.dictionary[Schedule.lang]['error'], {
                                        type: 'danger'
                                    });
                                    break;

                                case Schedule.statusCodes.UNAUTHORIZED:
                                    window.location = Caremed.urls.CaremedLogin + 'login?app=' + Caremed.appId;
                                    break;
                            }
                        }
                    } catch (err) {
                        console.error(err);
                    }


                },
                error: function(data){
                     ;
                }
            });
        },
        getEventDetails: function (callback) {
            var id = $('body').attr('data-meeting-id');
            $.ajax({
                url: Schedule.urls.EMS + 'schedule/' + id + '?token=' + Schedule.token,
                type: 'GET',
                success: function (data) {

                    if(data){
                        Schedule.Loads.loadFilterClock(function(){
                            $('#clock').val(data.data.clock.id);
                        });
                        Schedule.Loads.loadFilterRoom(function(){
                           $('#rooms').val(data.data.room.id); 
                        });
                        Schedule.Loads.loadFilterTeacher(function(){
                           $('#teachers').val(data.data.teacherId); 
                        });
                        
                        
                        
                        
                    }
                    var eventDet = data.data;
 
                },
                complete: function(eventDet){
                    callback(eventDet.responseJSON.data);
                }
            });
        },
        
        loadOrgTreeByType: function (typeId, callback, container) {
            var tree = {};
            $.ajax({
                url: Schedule.urls.HSIS + 'structures/bytype/' + typeId + '?token=' + Schedule.token,
                type: 'GET',
                beforeSend: function () {
                    if (typeof container !== "undefined") {
                        var obj = $('.small-loading').clone().toggleClass('small-loading tree-preloader').removeClass('hidden');
                        container.before(obj);
                        container.attr('check', 1);
                    }

                },
                success: function (data) {
                    if (data) {
                        switch (data.code) {
                            case Schedule.statusCodes.ERROR:
                                $.notify(Schedule.dictionary[Schedule.lang]['error'], {
                                    type: 'danger'
                                });
                                break;

                            case Schedule.statusCodes.OK:
                                tree = data.data;
                                break;

                            case Schedule.statusCodes.UNAUTHORIZED:
                                window.location = Schedule.urls.ROS + 'unauthorized';
                                break;

                        }
                    }
                },
                complete: function () {
                    callback(tree);
                }
            });
        },
        
        getFilteredStructureList: function (parentId, typeId, addressTreeId, callback, fullInfoFlag, children) {
            var structure = {};
            $.ajax({
                url: Schedule.urls.HSIS + 'structures/filter?parentId=' + parentId + '&typeId=' + typeId + '&addressTreeId=' + addressTreeId + '&token=' + Schedule.token + '&fullInfoFlag=' + (fullInfoFlag ? fullInfoFlag : '0') + '&children=' + (children ? children : '0'),
                type: 'GET',
                success: function (result) {
                    if (result) {
                        switch (result.code) {
                            case Schedule.statusCodes.OK:
                                structure = result.data;
                                callback(structure);
                                break;

                            case Schedule.statusCodes.ERROR:
                                $.notify(Schedule.dictionary[Schedule.lang]['error'], {
                                    type: 'danger'
                                });
                                break;

                            case Schedule.statusCodes.UNAUTHORIZED:
                                window.location = Schedule.urls.ROS + 'unauthorized';
                                break;

                        }
                    }
                }

            });

        },

        copyEvents: function(id, callback){
            $.ajax({
                url: Schedule.urls.EMS + 'course/'+ id +'/schedule/copy?token=' + Schedule.token,
                dataType: 'JSON',
                type: 'POST',
                data: {
                    meetingStartDate: moment($('#calendar').fullCalendar('getView').start).format("YYYY-MM-DD"),
                    meetingEndDate: moment($('#calendar').fullCalendar('getView').end).format("YYYY-MM-DD")
                },
                success: function(data) {
                    if (data) {
                        switch (data.code) {
                            case Schedule.statusCodes.ERROR:
                                if (data.message) {
                                    $.notify(data.message[Schedule.lang], {
                                        type: 'danger'
                                    });
                                }
                                else {
                                    $.notify(Schedule.dictionary[Schedule.lang]['error'], {
                                        type: 'danger'
                                    });
                                }
                                break;

                            case Schedule.statusCodes.OK:

                                $.notify(Schedule.dictionary[Schedule.lang]['success'], {
                                    type: 'success'
                                });
                                callback(data);
                                break;

                            case Schedule.statusCodes.UNAUTHORIZED:
                                window.location = Schedule.urls.ROS + 'login?app=' + Schedule.token;
                                break;

                        }
                    }
                }
            });
        },
    },
    Validation: {
        validateEmail: function (email) {
            var re = Schedule.REGEX.email;
            return re.test(email);
        },
        validateNumber: function (number) {
            var re = Schedule.REGEX.number;
            return re.test(number);
        },
        validatePhoneNumber: function (phone) {
            var re = Schedule.REGEX.phone;
            return re.test(phone);
        },
        validateDecimalNumber: function (number) {
            var re = Schedule.REGEX.decimalNumber;
            return re.test(number);
        },
        validateRequiredFields: function (requiredAttr) {
            var required = $('[' + requiredAttr + ']');

            var requiredIsEmpty = false;

            required.each(function (i, v) {
                if (v.value.length == 0 || (requiredAttr !== 'default-teaching-required' && requiredAttr !== 'default-required' && v.value == 0 && $(this).is('select'))) {
                    $(v).addClass('blank-required-field');

                    if (!requiredIsEmpty) {

                        $.notify(Schedule.dictionary[Schedule.lang]['required_fields'], {
                            type: 'danger'
                        });
                        requiredIsEmpty = true;
                    }

                    $(v).on('focusout', function (e) {
                        if (v.value.length && $(v).hasClass('blank-required-field')) {
                            $(v).removeClass('blank-required-field');
                            $(v).off('focusout');
                        }
                    });
                }
            });

            return !requiredIsEmpty;
        },
        checkFile: function (contentType, fileType) {
            var result = contentType.match(fileType);
            if (result) {
                return true;
            }
            else {

                return false;
            }
        }
    }
};