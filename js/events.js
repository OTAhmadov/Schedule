/* 
 Author: Abdullayev Tofik.
 Url: https://www.linkedin.com/in/abdullayevtofik
 */


$(function () {
    var chosenLang;

    if (document.cookie.indexOf('lang') == -1) {
        chosenLang = Schedule.lang;
    }

    else {
        chosenLang = Schedule.getCookie('lang');
    }

    setTimeout(function () {
        $(".fc-prev-button, .fc-next-button").on("click", function () {
            var dataView = $('body').attr('data-view');
            var viewMode = $('body').attr('data-mode');
            var id = $('body').find('#courses').val();
            //alert(id);
            Schedule.Loads.reLoadEvents();
            if (dataView === 'basicWeek' && viewMode === 'edit-mode' && id !== null && id && id !== "0") {
                $('body').find('.copy-events').removeClass('hidden').fadeIn(1);
            }
        });
    }, 50);


    $('.main-content').on('click', '.language-buttons a', function (e) {
        try {
            e.preventDefault();
            var lang = $(this).attr('id');

            if (lang != 'en' && lang != 'ru') {
                lang = 'az';
            }

            $('.language-buttons a').each(function () {
                $(this).removeAttr('data-chosen');
            });

            document.cookie = "lang=" + lang;
            window.location.reload();
        }
        catch (err) {
            console.error(err);
        }

    });

    if (Schedule.token == '0') {
        Schedule.initToken('tk');
    }
//        $('#logoutForm').attr("action", Ems.urls.ROS + "logout");
//        $('#logoutForm input[name="token"]').val(Ems.token);

    Schedule.loadLanguagePack('az');
    Schedule.loadLanguagePack('en');
    Schedule.loadLanguagePack('ru');

    setTimeout(function () {
        Schedule.i18n();
//            $.fn.datepicker.defaults.language = Schedule.lang;
//            $.extend(jconfirm.pluginDefaults, {
//                confirmButton: Schedule.dictionary[Schedule.lang]['ok'],
//                cancelButton: Schedule.dictionary[Schedule.lang]['close'],
//                title: Schedule.dictionary[Schedule.lang]['warning']
//            });
    }, 1000)

    $('.language-buttons a').each(function () {
        if ($(this).attr('id') == chosenLang) {
            $(this).parent('li').prependTo($('.language-buttons ul'));

        }
    });

//        $('#logoutForm').attr("action", Ems.urls.ROS + "logout");
//        $('#logoutForm input[name="token"]').val(Ems.token);
    //var module = Schedule.initCurrentModule('currModule');
    //console.log(module);
    Schedule.Loads.loadOperations('1000100');
    Schedule.Loads.getProfile();

//        $('body').on('click', '.jstree-anchor', function (e) {
//            try {
//                
//                var div = $(this).parent().closest('div').attr('id');
//                $('.content-body #buttons_div').attr('data-id', $(this).parent().attr('id'));
//                var node = $("#" + div).jstree('get_selected', true);
//                $('.content-body #buttons_div').attr('parent-node', node[0].parent);
//                Schedule.node = node;
//                var about = '';
//                var dicType;
//                Schedule.tempData.org = $(this).parents('li').attr('id');
//
//                $.each(Schedule.array, function (i, v) {
//                    if (Schedule.tempData.org == v.id) {
//                        about = v.about;
//                        dicType = v.dicType;
//                    }
//                });
//
//                $('.main-row').find('.div-info').html(about);
//                $('.content-body #buttons_div').attr('data-dicType-id', dicType);
//            }
//
//            catch (err) {
//                console.error(err);
//            }
//        });

    Schedule.Loads.loadApplications();
    Schedule.Loads.loadFilterStudyType();
    Schedule.Loads.loadFilterStudyLang();
    Schedule.Loads.loadFilterSemestr();


    $('#course-filter-form').on('submit', function (e) {
        e.preventDefault();
    });

    $('body').on('change', '#study-semestr, #study-lang, #study-type, #code', function () {
        var params = $('#course-filter-form').serialize();
        $('body').find('.submit-events').remove();
        $('body').find('#eventsToAdd').html('');
        Schedule.Loads.loadFilterCourses(params);
        // Schedule.Loads.loadEditEvents();
    });

    $('body').on('change', '#study-semestr-view, #study-lang-view, #study-type-view, #orgId', function () {
        var params = $('#course-filter-form-view').serialize();
        Schedule.Loads.loadFilterCourses(params);
        Schedule.Loads.loadEvents();
    });

    $('body').on('change', '#courses', function () {
        var courseStatus = $(this).find('option:selected').attr('data-status');

        $('#schedule_submit').fadeOut(1);
        var id = $(this).val();
        var params = $('#course-filter-form').serialize();
        Schedule.Loads.loadMeetings(id, courseStatus);
        Schedule.Loads.loadCourseEvents();

        var dataView = $('body').attr('data-view');
        var viewMode = $('body').attr('data-mode');
        if (dataView == 'basicWeek' && viewMode == 'edit-mode' && id > 0) {
            $('body').find('.copy-events').removeClass('hidden').fadeIn(1);
        } else {
            $('body').find('.copy-events').fadeOut(1);
        }


        for (var t = 0; t < Schedule.operationList.data.length; t++) {
            if (Schedule.operationList.data[t].id === 1001388) {
                $(".removeCopyButton").fadeIn().find("button").text(Schedule.operationList.data[t].name[Schedule.lang]).attr("onclick", "Schedule.Loads.removeCourseCopy(this,'" + id + "');");
            }
        }
        /*Schedule.operationList.data.each(function () {
           console.log(this);
        });*/

        /*$(".removeCopyButton").find("button");*/
    });
    $('body').on('change', '#courses-view', function () {
        var params = $('#course-filter-form-view').serialize();
        Schedule.Loads.loadEvents();
    });


    var date = new Date();
    var d = date.getDate();
    var m = date.getMonth();
    var y = date.getFullYear();

    var globalEvent;

    var weekDayGlobal;


    var cId = $('#calendar'); //Change the name if you want. I'm also using thsi add button for more actions

    //Generate the Calendar
    cId.fullCalendar({
        header: {
            right: '',
            center: 'prev, title, next',
            left: ''
        },
        lang: 'az',
        locale: 'az',
        theme: true, //Do not remove this as it ruin the design
        defaultView: 'basicWeek',
        selectable: false,
        selectHelper: false,
        editable: true,
        eventDurationEditable: false,
        firstDay: 1,

        views: {
            month: { // name of view
                columnHeaderFormat: 'dddd'
                // other view-specific options here
            },
            basicWeek: {
                columnHeaderFormat: 'D / dddd'
            }
        },
        //Add Events
        // events: [
        //     {
        //         title: 'Hangout with friends',
        //         start: new Date(y, m, 1),
        //         end: new Date(y, m, 2),
        //         className: 'bgm-cyan'
        //     },
        //     {
        //         title: 'Meeting with client',
        //         start: new Date(y, m, 10),
        //         allDay: true,
        //         className: 'bgm-red'
        //     }
        // ],

        events: function (start, end, timezone, callback) {
            $('#calendar').fullCalendar('removeEvents');

            GlobalmeetingStartDate = moment(start._d).format('YYYY-MM-DD');
            GlobalmeetingEndDate = moment(end._d).format('YYYY-MM-DD');
            $.ajax({
                url: Schedule.urls.EMS + 'schedule?token=' + Schedule.token,
                dataType: 'JSON',
                data: {
                    // our hypothetical feed requires UNIX timestamps
                    meetingStartDate: moment(start._d).format('YYYY-MM-DD'),
                    meetingEndDate: moment(end._d).format('YYYY-MM-DD'),
                    eduLangId: $('#study-lang-view').val(),
                    eduTypeId: $('#study-type-view').val(),
                    semestrId: $('#study-semestr-view').val(),
                    orgId: $('#orgId').val(),
                    courseId: $('#courses-view').val()
                },
                success: function (doc) {
                    var events = [];
                    $(doc.data).each(function (i, v) {
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


                    callback(events);

                }
            });

            var dataView = $('body').attr('data-view');
            var viewMode = $('body').attr('data-mode');
            var courseId = $('body').find('#courses').val();

            if (dataView == 'basicWeek' && viewMode == 'edit-mode' && courseId > 0) {
                $('body').find('.copy-events').removeClass('hidden').fadeIn(1);
            } else {
                $('body').find('.copy-events').fadeOut(1);
            }

        },


        //On Day Select
        droppable: true, // this allows things to be dropped onto the calendar
        dragRevertDuration: 0,
        drop: function (start, end, allDay, event) {

            $('#addNew-event .modal-body p.error-label').remove();
            // $(this).remove();

            var myEvent = $(this)
            myEvent.css('opacity', '0');


            eventDateGlobal = moment(start._d).format('YYYY-MM-DD');
            weekDayGlobal = +moment(start._d).format('e')


            $('body').attr('data-title', $('#study-lang option:selected').text());
            $('body').attr('data-eventobject', myEvent.text());
            $('body').attr('data-className', myEvent.attr('data-className'));
            $('body').attr('data-event-id', myEvent.attr('data-id'));
            $('body').attr('data-meeting-id', myEvent.attr('data-id'));

            Schedule.Loads.loadFilterClock(function () {
            });
            Schedule.Loads.loadFilterRoom(function () {
            });
            Schedule.Loads.loadFilterTeacher(function () {
            });


            $('#getStart').val(start);
            $('#getEnd').val(end);
            $('#addNew-event').modal('show');
        },
        displayEventStart: true,
        // timeFormat: 'H(:mm)' ,
        eventDrop: function (event, delta, revertFunc) {
            $('#addNew-event .modal-body p.error-label').remove();

            //  .format('YYYY-MM-DD'))
            $('body').attr('data-meeting-id', event.eventId);
            $('#calendar').fullCalendar('removeEvents', event._id);
            eventDateStartGlobal = moment($('#calendar').fullCalendar('getView').start).format("YYYY-MM-DD");
            eventDateEndGlobal = moment($('#calendar').fullCalendar('getView').end).format("YYYY-MM-DD");
            Schedule.Loads.getEventDetails(function (eventDetails) {
                var form = {
                    meetingDate: moment(event.start._d).format('YYYY-MM-DD'),
                    teacherId: eventDetails.teacherId,
                    weekDay: +moment(event.start._d).format('e'),
                    clockId: eventDetails.clock.id,
                    roomId: eventDetails.room.id
                }


                Schedule.Loads.editEvents(eventDateEndGlobal, eventDateStartGlobal, form, function () {


                });
            })
        },
        eventReceive: function (event) {
            $('#calendar').fullCalendar('removeEvents', event._id);
            GlobalmeetingStartDate = event.start._d;
            // GlobalmeetingndDate = event.end._d;

            var start = moment(event.start).format("HH:mm");
            $('#addNew-event .modal-body p.error-label').remove();
            //  );
        },
        // displayEventTime: true,
        eventRender: function (event, element, view) {
            element.find('.fc-title').before('<span class="fc-custom-time">' + event.clock + '</span>');
            element.find('.fc-custom-time').after('<span class="fc-type">' + event.lessonType + '</span>');
            element.find('.fc-type').after('<span class="fc-room">' + event.room + '</span>');
            element.find('.fc-title').after('<span class="fc-code">' + event.code + '</span>');
            element.find('.fc-code').after('<span class="fc-teacher">' + event.teacher + '</span>');


            element.attr('data-status', event.status)
            /*if (event.status == 1000340){

                event.editable = false;
            } */

        },

        eventDragStop: function (event, jsEvent, ui, view) {
            $('#addNew-event .modal-body p.error-label').remove();
            if (isEventOverDiv(jsEvent.clientX, jsEvent.clientY)) {


                $('body').attr('data-meeting-id', event.eventId);
                var el = $("<li class='fc-event' data-className='" + $('body').attr('data-className') + "' data-eventobject='" + $('body').attr('data-eventobject') + "' data-id='" + $('body').attr('data-meeting-id') + "'>").appendTo('#eventsToAdd').text(event.lessonTypeFull);
                el.draggable({
                    zIndex: 999,
                    revert: true,
                    appendTo: 'body',
                    containment: "#main",
                    scroll: false,
                    helper: 'clone',
                    revertDuration: 0,
                    start: function (event, ui) {
                        $('#sidebar .sidebar-inner').addClass('second-v');
                        $(this).hide();
                    },
                    stop: function () {
                        $('#sidebar .sidebar-inner').removeClass('second-v');
                        $(this).show()
                    }
                });
                el.data('event', {title: event.title, id: event.id, stick: true});
                $('#eventsToAdd').html('')
                Schedule.Loads.removeEvents();

            }


        },
        eventClick: function (event, jsEvent, view) {

            /*if (event.status == 1000340){

                event.editable = false;
            }else{*/
            $('#addNew-event .modal-body p.error-label').remove();
            globalEvent = event._id;
            // eventDateGlobal = moment(event.start._d).format('YYYY-MM-DD');
            // eventEndGlobal = moment(event.end._d).format('YYYY-MM-DD');
            $('body').attr('data-eventobject', event.lessonTypeFull)
            eventDateGlobal = moment(event.start).format("YYYY-MM-DD");
            eventDateStartGlobal = moment($('#calendar').fullCalendar('getView').start).format("YYYY-MM-DD");
            eventDateEndGlobal = moment($('#calendar').fullCalendar('getView').end).format("YYYY-MM-DD");
            weekDayGlobal = +moment(event.start._d).format('e')
            ;
            $('body').attr('data-meeting-id', event.eventId);
            Schedule.Loads.getEventDetails(function () {
                $('#addNew-event').modal('show');
            });
            /*}*/


        },
        eventOrder: "clock"

    });


    var isEventOverDiv = function (x, y) {

        var external_events = $('#sidebar');
        var offset = external_events.offset();
        offset.right = external_events.width() + offset.left;
        offset.bottom = external_events.height() + offset.top;


        if (x >= offset.left
            && y >= offset.top
            && x <= offset.right
            && y <= offset.bottom) {
            return true;
        }
        return false;

    }


    var actionMenu = '<ul class="actions actions-alt" id="fc-actions">' +
        '<li class="dropdown">' +
        '<a href="" data-toggle="dropdown"><i class="md md-more-vert"></i></a>' +
        '<ul class="dropdown-menu dropdown-menu-right">' +
        '<li class="active">' +
        '<a data-view="month" href="">Ay</a>' +
        '</li>' +
        '<li>' +
        '<a data-view="basicWeek" href="">Həftə</a>' +
        '</li>' +
        '<li>' +
        '<a data-view="basicDay" href="">Gün</a>' +
        '</li>' +
        '</ul>' +
        '</div>' +
        '</li>';


    cId.find('.fc-toolbar').append(actionMenu);


    (function () {
        $('body').on('click', '.event-tag > span', function () {
            $('.event-tag > span').removeClass('selected');
            $(this).addClass('selected');
        });
    })();


    $('body').on('click', '#addEvent', function () {
        $('#addNew-event .modal-body p.error-label').remove();
        var eventName = $('body').attr('data-title');
        var lessonType = $('body').attr('data-eventobject');
        var clock = $('#clock option:selected').text();
        var room = $('#rooms option:selected').text();
        var teacher = $('#teachers option:selected').text();
        var clockValue = $('#clock').val();
        var roomValue = $('#rooms').val();
        var teacherValue = $('#teachers').val();


        if (Schedule.Validation.validateRequiredFields('data-required-field')) {
            $('#calendar').fullCalendar('removeEvents', globalEvent);

            eventDateStartGlobal = moment($('#calendar').fullCalendar('getView').start).format("YYYY-MM-DD");
            eventDateEndGlobal = moment($('#calendar').fullCalendar('getView').end).format("YYYY-MM-DD");
            var form = {
                meetingDate: eventDateGlobal,
                teacherId: teacherValue,
                weekDay: weekDayGlobal,
                clockId: clockValue,
                roomId: roomValue
            }
            var somevar;


            Schedule.Loads.editEvents(eventDateEndGlobal, eventDateStartGlobal, form, function () {


            });


        }

    });


    $('#addNew-event').on('shown.bs.modal', function () {
        $('#addNew-event .modal-body p.error-label').remove();

    });
    $('#addNew-event').on('hidden.bs.modal', function () {
        $('body').find('li[data-className="' + $('body').attr('data-className') + '"]').css('opacity', '1');
        $('#addNew-event .modal-body p.error-label').remove();
        $('select').removeClass('blank-required-field');
    });


    $('body').on('click', '#fc-actions [data-view]', function (e) {
        e.preventDefault();
        var dataView = $(this).attr('data-view');
        var viewMode = $('body').attr('data-mode');
        var courseId = $('body').find('#courses').val();

        $('body').attr('data-view', dataView);
        if (dataView == 'basicWeek' && viewMode == 'edit-mode' && courseId > 0) {
            $('body').find('.copy-events').removeClass('hidden').fadeIn(1);
        } else {
            $('body').find('.copy-events').fadeOut(1);
        }
        $('#fc-actions li').removeClass('active');
        $(this).parent().addClass('active');
        cId.fullCalendar('changeView', dataView);
    });

    $('body').on('click', '#refresh', function () {
        // $('#sidebar .sidebar-inner').addClass('second-v');
        $('body').attr('data-mode', 'edit-mode');
        var dataView = $('body').attr('data-view');
        var viewMode = $('body').attr('data-mode');
        var courseId = $('body').find('#courses').val();
        $('.view-block').stop().fadeOut();
        $('.second-view').stop().fadeIn();
        $('.overlay').hide();
        Schedule.Loads.reLoadEvents();

        if (dataView == 'basicWeek' && viewMode == 'edit-mode' && courseId > 0) {
            $('body').find('.copy-events').removeClass('hidden').fadeIn(1);
        } else {
            $('body').find('.copy-events').fadeOut(1);
        }

    });

    $('body').on('click', '#back', function () {
        // $('#sidebar .sidebar-inner').removeClass('second-v');
        var dataView = $('body').attr('data-view');
        var viewMode = $('body').attr('data-mode');
        $('.view-block').stop().fadeOut();
        $('.first-view').stop().fadeIn();
        $('.overlay').show();
        Schedule.Loads.reLoadEvents();
        $('body').attr('data-mode', 'view-mode');
        $('body').find('.copy-events').addClass('hidden').fadeOut(1);
    });

    $('body').on('click', '#schedule_submit', function () {
        if ($('#eventsToAdd li').length < 1) {

            Schedule.Loads.submitEvents();
        }

    });

    $('body').on('click', '.copy-events', function () {
        var id = $('body').find('#courses').val();
        var thisEl = $(this);
        Schedule.Loads.copyEvents(id, function (data) {
            thisEl.fadeOut();
            var courseStatus = $('#courses').find('option:selected').attr('data-status');
            var id = $('#courses').val();
            Schedule.Loads.loadMeetings(id, courseStatus);
            Schedule.Loads.reLoadEvents();
        })
    })
});


        $('body').on('click', '.copy-events', function(){
            var id = $('body').find('#courses').val();
            var thisEl = $(this); 
            Schedule.Loads.copyEvents(id, function(data){
                thisEl.fadeOut();
                var courseStatus = $('#courses').find('option:selected').attr('data-status');
                var id = $('#courses').val();
                Schedule.Loads.loadMeetings(id, courseStatus);
                Schedule.Loads.reLoadEvents();
            })
        });

        $('body').on('click', '.hide-menu', function () {
            $('.app-list').stop().slideToggle();
        });

     $(window).resize(function () {
        var width = window.innerWidth;
        if(width > 1500) {
            $('.app-list').show();
        } else {
            $(document).on('click','.hide-menu',function(e){
                e.stopPropagation();
                var display = $(".app-list").css('display');
                if(display === "none") {
                    $('.app-list').fadeIn();
                } else{
                    $('.app-list').fadeOut();
                }
            });

            $("body").on("click",function() {
                $('.app-list').hide();
            });
        }
    });

    $(".schedule-user").on("click", function () {
        $('.user-info').toggleClass("helloWorld");
        return false;
    });

