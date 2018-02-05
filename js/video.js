$(function(){
    "use strict";
    //关闭按钮点击事件
    $('#close>img').click(function(){
        $('#modal').fadeOut();
    });
    var videoHtml='';
    var videoArr=[];//以3条内容为一组，生成新的二维数组
    var videoIndex=0;
    var propertyID=location.search.slice(12);//3 楼盘id参数名
    $.ajax({
        url:'http://192.168.1.186/efangpt/view/getLiveList.do',
        type:'POST',
        data:{
            propertyID:propertyID
        },
        success:function(data){
            //console.log(data.data);
            if(data.status===1){
                var videoData=data.data;
                if(videoData.length==0){
                    $('#btns').hide();//按钮不显示
                    alert('该项目未安装摄像头，无法进行观看');
                }else{
                    for(var j=0;j<videoData.length/2;j++){
                        videoArr.push(videoData.slice(2*j,2*j+2));
                    }
                    //console.log(videoArr);
                    $.each(videoArr[0],function(i){
                        videoHtml+=`
        <div class="container">
            <video autoplay id="play${i}" width="380" height="197" poster="" controls playsInline webkit-playsinline>
               <source src="${videoArr[0][i].rtmpVd}" type="" />
               <source src="${videoArr[0][i].HlsVd}" type="application/x-mpegURL" />
            </video>
            <h2>${videoArr[0][i].videoName}</h2>
        </div>
                        `;
                    });
                    $('#present_video').html(videoHtml);
                    //所有视频待播放状态
                    for(var i=0;i<videoArr[0].length;i++){
                        new EZUIPlayer('play'+i).play();
                    }
                    if(videoData.length<=2){
                        $('#btns').hide();//按钮不显示
                    }
                }
            }else{
                alert('服务器内部错误');
            }
        },
        error:function(){
            alert('网络繁忙，请稍后重试');
        }
    });
    //上一页，下一页按钮的点击事件
    $('#btns').on('click','.next',function(){
        videoHtml='';
        videoIndex++;
        $('#btns>.prev').removeAttr('disabled');
        //下一页的临界条件
        if(videoIndex>=videoArr.length-1){
            $('#btns>.next').attr('disabled','disabled');
            videoIndex=videoArr.length;
            videoIndex--;
        }
        $.each(videoArr[videoIndex],function(i){
            videoHtml+=`
        <div class="container">
            <video autoplay id="play${i}" width="380" height="197" poster="" controls playsInline webkit-playsinline>
               <source src="${videoArr[videoIndex][i].rtmpVd}" type="" />
               <source src="${videoArr[videoIndex][i].HlsVd}" type="application/x-mpegURL" />
            </video>
            <h2>${videoArr[videoIndex][i].videoName}</h2>
        </div>
                        `;
        });
        $('#present_video').html(videoHtml);
        //所有视频待播放状态
        for(var i=0;i<videoArr[videoIndex].length;i++){
            new EZUIPlayer('play'+i).on('play',function(){
                console.log(play);
            });
        }
    })
        .on('click','.prev',function(){
            videoHtml='';
            videoIndex--;
            $('#btns>.next').removeAttr('disabled');
            //下一页的临界条件
            if(videoIndex<=0){
                $('#btns>.prev').attr('disabled','disabled');
                videoIndex=0;
            }
            $.each(videoArr[videoIndex],function(i){
                videoHtml+=`
        <div class="container">
            <video autoplay id="play${i}" width="380" height="197" poster="" controls playsInline webkit-playsinline>
               <source src="${videoArr[videoIndex][i].rtmpVd}" type="" />
               <source src="${videoArr[videoIndex][i].HlsVd}" type="application/x-mpegURL" />
            </video>
            <h2>${videoArr[videoIndex][i].videoName}</h2>
        </div>
                        `;
            });
            $('#present_video').html(videoHtml);
            //所有视频待播放状态
            for(var i=0;i<videoArr[videoIndex].length;i++){
                new EZUIPlayer('play'+i).on('play',function(){
                    console.log(play);
                });
            }
        });
});