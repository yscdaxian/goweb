/*
############################################################################################
####  Name:             go_user_ce.js                                                   ####
####  Type:             ci js for users                                                 ####
####  Version:          3.0                                                             ####
####  Copyright:        GOAutoDial Inc. - Franco Hora <info@goautodial.com>             ####
####  License:          AGPLv2                                                          ####
############################################################################################
*/

var protocol = window.location.protocol;
var host = window.location.host;
var path_string = window.location.pathname.substr(1);
var basepath = path_string.split("/")[0];

//override value 0f basepath
if(basepath === "index.php"){
    basepath = "";
}else{
    basepath = "/"+basepath;
}


// to check if create group is in action
var $newHgroup=null;
var $activeElement = null;


function passtophp (){
  return $activeElement;
}
$(function (){

    $('#tab-nav').tabs({

        ajaxOptions:{
              data:{userid:passtophp},
              type: "POST",
              cache: false
        },
        show: function (){ // disable the advance tab?
            try{
                //$(this).tabs({disabled:[1]});
                $(this).tabs("option","disabled",[1,2]);
                $activeElement = null; 
            }catch(err){}
        },
        fx: {opacity : 'toggle'},
        disabled : [1,2],
        cache: false
    });


});

$(function (){

    $('div.group-toggle').click(function (){
        var $id = $(this).attr("id");
        var $group = $id.replace('toggle-',"");

        $("#"+$group).slideToggle("fast",function(){
              $(this).parent().toggleClass("closed");
        });
    });

});

$(function (){

    $('div.ungroup-toggle').click(function (){
        var $id = $(this).attr("id");
        var $group = $id.replace('toggle','quickedit');
        var $userid = $id.replace('ungroup-toggle-',"");

        $("#"+$group).slideToggle("fast",function(){
              $(this).parent().toggleClass(function(){
                   if($(this).hasClass('closed') == false){
                       $("#tab-nav").tabs("option","disabled",[1]);
                       return "closed";
                   }else{
                       $activeElement = $(this).attr("id");
                       $(this).siblings().each(function(){
                           if($(this).hasClass('closed') === false){
                                $(this).toggleClass('closed');
                                $(this).children('div[id^="ungroup-quickedit-"]').hide();
                           }
                       });
                 
                       $("#tab-nav").tabs("option","disabled",[]);
                       return "closed";
                   }
              });
              $.getJSON(
                       protocol+"//"+host+basepath+"/index.php/go_user_ce/collectuserinfo/"+$("#vicidial_user_id-"+$userid).val(),
                       function (data){
                            //console.log(data);
                           $("#"+$userid+"-pass").val(data[0].pass);
                           $("#"+$userid+"-full_name").val(data[0].full_name);
                           $("#phone_login-"+$userid).val(data[0].phone_login);
                           $("#phone_pass-"+$userid).val(data[0].phone_pass);
                           $("#active-"+$userid+" option[value='"+data[0].active+"']").attr('selected','selected');
                       }
              );
        });
    });

});



$(document).ready(function (){

    $('div[class|="draggable"]').each(function (index){
        var $id = $(this).attr("id");
        $("#"+$id).click(function(){
            $('.inside').load(protocol+"//"+host+basepath+"/index.php/go_user_ce/modifyuser/",{userid:$id});
        });
    });

});


$(document).ready(function (){
    $('div[class|="groupsuser"]').each(function (index){
         var $id = $(this).attr("id");
         $("#"+$id).jstree({
                             "themes" : {"theme": "default", "icons": false},
                             "destroy" : {"set_focus": false},
                             "plugins":["themes","html_data"]
                           });
    });
});

$(function (){

    $('.user-tbl-cols').delegate('a','click',function(){
         try{
             if($(this).attr('id').indexOf('status') !== -1){
                 $activeElement = $(this).attr('id').replace('user-status-','');
                 $("#tab-nav").tabs("option","disabled",[2]);
                 $('#tab-nav').tabs("url",1,"userstatus"); 
                 $('#tab-nav').tabs("select",1);
             }else if($(this).attr('id').indexOf('adv') !== -1){
                 $activeElement = $(this).attr('id').replace('user-adv-','');
                 $("#tab-nav").tabs("option","disabled",[1]);
                 $('#tab-nav').tabs("url",2,"advancemodifyuser"); 
                 $('#tab-nav').tabs("select",2);
             }
         }catch(err){
             console.log(err);
         }
    });

    $('.user-actions-cols').delegate('a','click',function(){
         var $user = $(this).attr('id').replace('user-action-modify-','');
         var $viciId = $(this).attr('rel');
         if($(this).attr('id').indexOf('action-modify') !== -1){
              $('.overlay-modify').show().fadeIn(900);
              $('.wizard-box-modify').animate({opacity:1},1000);
              var $positions = $('.wizard-box-modify').offset();
              $('.add-close-modify').animate({opacity:1},1000).offset({top:($positions.top - 10),left:(($positions.left + $('.wizard-box-modify').width()) - 5)});
              $('.wizard-box-modify').children().each(function(){
                    if($(this).is('form')){
                         $(this).attr('id',"form-"+$user);
                         $(this).children('div.boxrightside').each(function(index){
                              $(this).children().each(function(){
                                if($(this).is('label') === false){
                                   var $currId = $(this).attr('id');
                                   if($currId.indexOf('users_id') !== -1){
                                        $(this).attr("id","users_id-"+$user);
                                        $(this).attr("name","users_id-"+$user);
                                        $(this).attr("value",$user);
                                   }
                                   if($currId.indexOf('vicidial_user_id') !== -1){
                                        $(this).attr("id","vicidial_user_id-"+$user);
                                        $(this).attr("name","vicidial_user_id-"+$user);
                                        $(this).attr("value",$viciId);
                                   }
                                   if($currId.indexOf('pass') !== -1){
                                        $(this).attr("id",$user+"-pass");
                                        $(this).attr("name",$user+"-pass");
                                   }
                                   if($currId.indexOf('full_name') !== -1){
                                        $(this).attr("id",$user+"-full_name");
                                        $(this).attr("name",$user+"-full_name");
                                   }
                                   if($currId.indexOf('phone_login') !== -1){
                                        $(this).attr("id","phone_login-"+$user);
                                        $(this).attr("name","phone_login-"+$user);
                                   }
                                   if($currId.indexOf('phone_pass') !== -1){
                                        $(this).attr("id","phone_pass-"+$user);
                                        $(this).attr("name","phone_pass-"+$user);
                                   }
                                   if($currId.indexOf('active') !== -1){
                                        $(this).attr("id","active-"+$user);
                                        $(this).attr("name","active-"+$user);
                                   }
                                }
                              });
                              if(index === 0){
                                  var $hiddenFields = $(this).children('input');
                                  $(this).empty();
                                  $(this).prepend($user);
                                  $(this).append($hiddenFields);
                              }
                         });
                         $.post(
                               protocol+"//"+host+basepath+"/index.php/go_user_ce/collectuserinfo/"+$viciId,
                               function(data){
                                  $.each(data,function(){
                                      $("#"+$user+"-pass").val(this.pass);
                                      $("#"+$user+"-full_name").val(this.full_name);
                                      $("#phone_login-"+$user).val(this.phone_login);
                                      $("#phone_pass-"+$user).val(this.phone_pass);
                                      $("#active-"+$user+" option[value='"+this.active+"']").attr('selected','selected');
                                  }); 
                               } 
                         );
                    }
              });
         }else if($(this).attr('id').indexOf('action-delete') !== -1){
              if(confirm("Do you really want to disable this agent?")){
                     $post = $.extend({},{vicidial_user_id:$(this).attr('id').replace('user-action-delete-',""),users_id:$(this).attr('rel')});
                     $.post(
                           protocol+"//"+host+basepath+"/index.php/go_user_ce/deleteuser/"+$post.users_id+"/"+$post.vicidial_user_id,
                           function (data){
                                alert(data);
                                $("#"+$post.vicidial_user_id).children("div:nth-child(3)").empty();
                                $("#"+$post.vicidial_user_id).children("div:nth-child(3)").append("<span class='inactive'>Inactive</span>");
                           }
                     );
              }
         }else if($(this).attr('id').indexOf('action-info') !== -1){
              $activeElement = $(this).attr('id').replace('user-action-info-','');
              try{
                  if($(this).attr('id').indexOf('info') !== -1){
                        $('.overlay-info').show().fadeIn(900);
                        $('.wizard-box-info').animate({opacity:1},1000);
                        var $positions = $('.wizard-box-info').offset();
                        $('.add-close-info').animate({opacity:1},1000).offset({top:($positions.top - 10),left:(($positions.left + $('.wizard-box-info').width()) - 5)});
                        $.post(
                               protocol+'//'+host+basepath+'/index.php/go_user_ce/userinfo',
                               {userid:$activeElement},
                               function(data){
                                   if(data.indexOf('Error') === -1){ 
                                      var $userinfo = JSON.parse(data);
                                      $('#widgetField').children('span').attr('id','user-stat-'+$userinfo[0][0].user);
                                      $('.userstatus-display').children().each(function(){
                                           if($(this).is('strong')){
                                                $(this).empty();
                                                $(this).append($userinfo[0][0].user+" - "+$userinfo[0][0].full_name);
                                           }else if($(this).hasClass('rightside')){
                                                $(this).empty();
                                                if($userinfo[1].length > 0){
                                                     switch($(this).attr('id')){
                                                         case 'server_ip':
                                                             $(this).append($userinfo[1][0].server_ip);
                                                         break;
                                                         case 'conf_exten':
                                                             $(this).append($userinfo[1][0].conf_exten);
                                                         break;
                                                         case 'extension':
                                                             $(this).append($userinfo[1][0].extension);
                                                         break;
                                                         case 'campaign_id':
                                                             $(this).append($userinfo[1][0].campaign_id);
                                                         break;                                              
                                                         case 'status':
                                                             $(this).append($userinfo[1][0].status);
                                                         break;                                              
                                                         case 'last_call_finish':
                                                             $(this).append($userinfo[1][0].last_call_finish);
                                                         break;                                              
                                                         case 'close_campaigns':
                                                             $(this).append($userinfo[1][0].close_campaigns);
                                                         break;                                              
                                                     }
                                                }
                                           }
                                      });
                                      $(".emergency-container").attr("id",$userinfo[0][0].user);
                                   }else{
                                      alert(data);
                                   }
                               }
                        );
                  }
              }catch(err){
                  console.log(err);
              } 
         }
    }); 



});


$(function (){

    $('.groupsuser').delegate('a','click',function (){
         var $id = $(this).attr("id");
         var $group = $id.replace("hierarchy-","");
         $('.inside').load(protocol+"//"+host+basepath+"/index.php/go_user_ce/advancemodifyuser/",{userid:$group});
    }); 

});

$(function (){
    $('.groups').delegate('h3','click',function(){
         var $id = $(this).parent().attr("id");
         var $group = $id.replace("hierarchy-","");
         var $group = $group.replace("groups-","");
         if($id != 'groups-SUPTLIT' && $id != 'groups-AGENTS' ){
             $('.inside').load(protocol+"//"+host+basepath+"/index.php/go_user_ce/advancemodifyuser/",{userid:$group});
         }
    });
});




// function to display all useraccess
$(function() {

     $('.user-groups').delegate('h3','click',function (){
          var $id = $(this).parent().attr("id");  
          var $ids = $id.replace("user-groups-","");
          var $groupid = $ids.substr(0,$ids.indexOf("-"));
          var $group_ownerid = $ids.substr($ids.indexOf("--")+1);
         
          //display the useraccess
          $(this).siblings(".adv-allowed-access").slideToggle("fast",function(){
              $(this).parent().toggleClass(
                                     function(){
                                        if($(this).hasClass('inactive') !== false){
                                            try{
                                                // check if we are in create if so delete the group 
                                                $created = $('#user-groups').find('div[class="new-user-groups"]');
                                                $('#'+$created.attr('id')).detach();
                                                var $newid = $created.attr('id');
                                                // remove from database
                                                $.post(
                                                       protocol+'//'+host+basepath+'/index.php/go_user_ce/deleteitem/',
                                                       {groupid:$newid.substring($newid.indexOf('groups-')+7,$newid.indexOf('--'))}
                                                );
                                            }catch(err){}
                                            $(this).siblings().each(function(){
                                                if($(this).hasClass('inactive') === false){
                                                    // this is the siblings object put inactive so we can have only one active elements
                                                   $(this).toggleClass('inactive'); 
                                                   $(this).children('div').attr('style','block:none;');

                                                }
                                            });

                                            return "inactive";
                                        }else{
                                            return 'inactive';
                                        }
                                     }
                               );
              //$(".adv-user-groups").tinyscrollbar_update('relative');
          });
     });

});


$(function (){
   $(".adv-settings-actions").delegate('a','click',function(){
       console.log($(this)); 
       alert('unfinished business');
   });
});

// for admin select or deselect
$(function(){
    $("div[id^='access']").click(function(){ 
         //$(this).toggleClass("highlight");
         $(this).toggleClass(function(){
             if($(this).hasClass('highlight') === true){
                  $(this).children('p').attr('style','display:none;');
                  return 'highlight';
             }else{
                  $(this).children('p').attr('style','display:block;');
                  return 'highlight';
             }
         });
    });
});

/*
 * bubble message
 */
$(function(){
    try{
         $("div[class$='content']").delegate("div.cols","mouseover",function(){
              var $edge = $(this).width();
              if($(this).hasClass('bubble')){
                  var $position = $(this).offset();
                  var $elemRowIndex = $(this).parent().index(); // row
                  var $currentObj = $(this).parent().parent();
                  var $callThis = ":nth-child("+$elemRowIndex+")";
                  var $monitorWidth = $(window).width();
                  var $displayThis = $("."+$currentObj.attr("class")).children("div"+$callThis);

                  $($displayThis).show();
                  //initial position
                  $($displayThis).offset({top:$position.top,left:$position.left+($edge-30)});

                  //for repositioning y adjustments
                  var $elemWidth = $($displayThis).width(); 
                  $position = $($displayThis).offset();
                  var $lampasChecker = $position.left + $elemWidth;
                  if($lampasChecker > $monitorWidth){
                      $($displayThis).offset({top:$position.top,left:$position.left-((Math.round($lampasChecker-$monitorWidth))+7)});
                  }

                  //for position x adjustments
                  var $elemHeight = $($displayThis).outerHeight();
                  $position = $($displayThis).offset();
                  //repositioning
                  $($displayThis).offset({top:($position.top-$elemHeight),left:$position.left});
              }
         }).mouseout(function(){
              $(this).children('div.realValue').hide();
         });
    }catch(err){
    }
});




$(function(){

   $("#user-search").autocomplete({
          source:function(request,response){
               $.post(
                      protocol+'//'+host+basepath+'/index.php/go_user_ce/usersearch',
                      request,
                      function (data){
                         $('#user-container').children('div').find('div.user-tbl-rows').fadeOut(900);
                         var $displays = $.makeArray(JSON.parse(data));
                         response($displays);
                         $("#user-container").children('div').find('div.user-tbl-rows').each(function(){
                              var $showThis = $(this);
                              $.each($.makeArray($displays),function(){
                                   if(this.value === $showThis.attr("id")){
                                       $showThis.fadeIn(900);
                                   }
                              });
                         });
                      }
               );
          }
   });

});


$(function(){

   $("#searchcall").click(function(){
               $.post(
                      protocol+'//'+host+basepath+'/index.php/go_user_ce/usersearch',
                      {term:$('#user-search').val()},
                      function (data){
                         $('#user-container').children('div').find('div.user-tbl-rows').fadeOut(900);
                         var $displays = $.makeArray(JSON.parse(data));
                         $("#user-container").children('div').find('div.user-tbl-rows').each(function(){
                              var $showThis = $(this);
                              $.each($.makeArray($displays),function(){
                                   $showThis.children('div.user-tbl-cols').each(function(){
                                        if($(this).children().is('div') === false){
                                             if($(this).text().indexOf($('#user-search').val()) !== -1){
                                                  $(this).parent().fadeIn(900);
                                             }
                                        }
                                   });
                              });
                         });
                      }
               );
   });

});

$(function(){
    $('.adv-userinfo-action').delegate('a','click',function(){
        if($(this).attr('id').indexOf('save') !== -1){
            var $form = $(this).parent().parent();
            var $user = $(this).attr('id').replace('user-adv-save-','');
            var $user_id = $(this).parent().attr('id').replace('userinfo-action-','');
            var $elems = [];
            var $access = [];
            var $posts = null;
            $.each($form.serializeArray(),function(){
                 $elems[this.name] = this.value;
            });
            $('.adv-permissions-elem').children().each(function(){
                if($(this).is('input')){
                    if($(this).prop('checked')){
                       $access[$(this).val()] = 1;
                    }else{
                       $access[$(this).val()] = 0;
                    }
                }else if($(this).is('select')){
                    $access[$(this).attr('id').replace('access-','')] = $(this).val();
                }
            });
            $posts = $.extend({},$elems,$access);
            $($form).validate({
                    submitHandler: function(form){
                         if(this.valid()){
                                 $.post(
                                          protocol+"//"+host+basepath+'/index.php/go_user_ce/updateuser/'+$user_id+"/"+$user,
                                          $posts,
                                          function(data){
                                              alert(data);
                                          }
                                 );
                         }
                    }
            });
            $form.children("div.rightcol").find("input[id^='"+$user+"']").each(function(){
                 $(this).rules("add",{required:true,minlength:2,messages:{required:"* req",minlength:"Atleast 2 char"}});
            });
            $form.submit();
        }else if($(this).attr('id').indexOf('cancel') !== -1){
            $('#tab-nav').tabs("option","disabled",[3]);
            $('#tab-nav').tabs("select",0);
        }
    });

    $(".user-cols-action-lbl").delegate('img','click',function(){
        var $position = $(this).offset();
        var $origpos = $('.user-batch-action').offset();
        $(".user-batch-action").slideToggle(900).offset({top:$position.top + 10,left:($position.left - $(".user-batch-action").width())});
    });
});

$(function(){
    $("#batch").click(function(){
        if($(this).prop('checked')){
            $('.user-tbl-rows').children().find('input[type=checkbox]').prop('checked',true);
        }else{
            $('.user-tbl-rows').children().find('input[type=checkbox]').prop('checked',false);
        }
    });

    $(".user-batch-action").delegate('a','click',function(){
         var $batch = [];
         var $users = null;
         var $elemId = $(this);
         var $action = null;
         $('.user-actions-cols').children("input[type='checkbox']").each(function(){
              if($(this).prop('checked')===true){
                  if($elemId.attr('id').indexOf('batch-activate') !== -1){
                      $action = "Y";
		  }
                  if($elemId.attr('id').indexOf('batch-deactivate') !== -1 || $elemId.attr('id').indexOf('batch-delete') !== -1){
                      $action = "N";
		  }
                  
                  $batch[$batch.length] = {user:$(this).val(),user_id:$(this).attr('rel'),action:$action};
              }
         });
         $users = JSON.stringify($batch);
         if($batch.length > 0){
              $.post(
                     protocol+'//'+host+basepath+'/index.php/go_user_ce/batchupdate/',
                     {users:$users},
                     function(data){
                         var result = JSON.parse(data);
                         $.each(result,function(){
                             if(this.result.indexOf('Error') === -1){
                                 if($action === 'Y'){
                                     $displayAction = "<span class='active'>Active</span>";
                                 }else{
                                     $displayAction = "<span class='inactive'>Inctive</span>";
                                 }
                                 $("#"+this.user).children('div:nth-child(3)').empty().append($displayAction);
                                 $("#user-action-chkbx-"+this.user).prop("checked",false);
                                 $('#batch').prop("checked",false);
                             }else{
                                alert(data); return false;
                             }
                         });
                     }
                
              );
         }
    });

});

var $clickhdr = null;
$(function(){

  //$('div.user-hdr').delegate('strong','click',function(){
  $('.sorter').click(function(){
      var $hdr = $(this).parent();
      var $col = $($hdr).index();
      var $order = null;
      var $newobj = $('.user-tbl-container');
      if($($hdr).hasClass('user-cols-action-lbl') === false){
         if($($hdr).hasClass('desc')===true){
               $order = "desc";
               //$(this).attr("src",protocol+"//"+host+"/js/tablesorter/themes/blue/desc.gif");
         }else{
               $order = "asc";
               //$(this).attr("src",protocol+"//"+host+"/js/tablesorter/themes/blue/asc.gif");
         }
         sortrows($newobj,$col,$order);
         $($hdr).toggleClass("desc");
         $($hdr).siblings().toggleClass("desc");
      }
  });

});

$(function(){
    $(".toolTip").tipTip();
});

$(function(){

    $obj = $(".user-tbl-container");

    $(".pager-perpage > select").change(function(){
         paginate($obj,$(this).val());
    });

    // first page
    $("#pager-firstpage").click(function(){
             if($perpage !== "all"){
                 firstpage($obj);
             }
    });
      
    // back page
    $("#pager-prevpage").click(function(){
             if($perpage !== "all"){
                 $curr_page = $(".pager-paginater > input");
                 $next = parseInt($($curr_page).val()) - parseInt(1);
                 backpage($obj,$next);
             }
    });

    // next page
    $("#pager-nextpage").click(function(){
             if($perpage !== "all"){
                 $curr_page = $(".pager-paginater > input");
                 $next = parseInt($($curr_page).val()) + parseInt(1);
                 nextpage($obj,$next);
             }
    });

    // last page
    $("#pager-lastpage").click(function(){
            if($perpage !== "all"){
               lastpage($obj,$total_page);
            }
    });

});


$(function(){

    try {

        if(window.paginate) {

            paginate($(".user-tbl-container"),$(".pager-perpage > select").val());

        }

    } catch(err) {

       console.log(err);

    }
});
