    $(function () {
        'use strict';
        var $add_file_task=$(".add_task");
        var $moving,$detailing,$detail_submit,$task_item,$check;
        var task_list=[];//定义数组

        $add_file_task.on('submit',function (e) {
            var new_task={}; //用户输入变量

            e.preventDefault();
            new_task.value=$add_file_task.find('input').val();
            //value为css内容生成属性
            console.log(new_task);
            if (!new_task.value) return; //检验用户是否输入
            add_task(new_task);//数据存储
        });

        init();//报错

        function add_task(new_task) {
            task_list.push(new_task);//添加task进list里
            refresh();
            // new_task=JSON.stringify(new_task);
            // localStorage.setItem("task_list",new_task);//更新local storage
            // console.log(store.get('task_list'));
        }

        function init() {
            task_list=store.get("task_list")||[];
                loop_list();
        }

        function join_list(new_task,index) { //单个list模板
            if (!new_task || index=="undefined") return;
            var temple =
                '<div class="task_list" data-index="'+index+'">'+
                //checkbox加入判断，当result为true时，打勾
                '<span><input class="check" type="checkbox" '+(new_task.result ? 'checked' : "")+'></span>'+
                '<span class="task_content">'+
                'abc</span>'+
                '<span class="rightmove"><span class="moving"> 删除</span>'+
                '<span class="detailing"> 详情</span></span>'+
                '</div>';

            temple=temple.split("abc");
            temple=temple[0]+new_task.value+temple[1];
            return temple
        }

        function refresh() { //刷新页面
            store.set('task_list',task_list);
            loop_list()
        }

        function loop_list() {  //遍历添加task
            $(".main").html("");
            var $task;
            var complete_item = [];
            // console.log("task_list",task_list);
            for (var i=0;i<task_list.length;i++){
                var item=task_list[i];
                if (item.result) {
                    complete_item[i]=item;
                    }
                else {
                     $task=$(join_list(item,i));//在传入task_list的同时传入index数据
                     // console.log(2,task_list);
                     $(".main").prepend($task)}}

                console.log(complete_item);

            for (var j=0;j<complete_item.length;j++){
                $task=$(join_list(complete_item[j],j));//在传入task_list的同时传入index数据
                $task.addClass("completed");
                $(".main").append($task)
            }


            //主菜单定义类
            $task_item=$(".task_list");
            $moving = $(".moving"); //为task_list赋值后才能获取其中的类对象
            $detailing = $(".detailing");
            $check=$(".check");

            listen_moving(); //监听删除按钮，应放在init()中，放在loop_list()效果一样
            listen_detail(); //监听详情按钮
            listen_check(); //监听checkbox
        }


        function delete_task(index) {
            //没有index或者index不存在
            if (index == "undefined" || !task_list[index]) {return null}

            delete task_list[index];
            refresh()
        }

        //监听删除事件，确保能连续触发
        function listen_moving() {
            $moving.on("click",function () {
                //提取属性data-index中的id
                var index=$(this).parent().parent().data("index");
                var a = confirm("是否要删除？");

                a ? delete_task(index) : null
            });
        }


        function listen_detail() {
            $task_item.on("dblclick",function () {
                var index = $(this).data("index");
                detail(index)
            });

            $detailing.on("click", function () {
                var index = $(this).parent().parent().data("index");
                detail(index);
            });
        }


        function hide_mask() {
            $(".task_detail_mask").hide();
            $(".task_detail").hide()
        }


        $(".task_detail_mask").on("click",function () {
            hide_mask()
        });

        //查看详情
        function detail(index){
            if (index == "undefined" || !task_list[index]) {return null}
            loop_detail(index);
            $(".task_detail").show();
            $(".task_detail_mask").show();
        }
        
        function update_task(index,data) {
            if (!index||!task_list[index]) return;
            //用detail中的数据更新task_list
            console.log(data);
            task_list[index]=$.extend(task_list[index],data); //merge方法无效
            // console.log(task_list[index]);
            refresh()
        }

        function loop_detail(index) {
            if (index == "undefined" || !task_list[index]) return;
            var task=task_list[index] ; //详情页的title
            var item=
                '<form>'+
                '<div class="content">'+
                '<div class="content_title">'+
                //避免出现undefined
                task.value+
                '</div>'+
                '<input style="display:none" type="text" name="data_content" value="'+(task.value || "")+'">'+
                '</div>'+
                '<div class="desc">'+
                '<textarea name="desc" cols="30" rows="10">'+(task.desc || "")+'</textarea>'+
                '</div>'+
                '<div class="time">'+
                '<label for="">提醒时间</label>'+
                '<input type="text" name="date" class="date_time" value="'+(task.date || "")+'">'+
                '</div>'+
                '<button type="submit">submit</button>'+
                '</form>';

            $(".task_detail").html(""); //重构详细页面
            $(".task_detail").append(item);
            $(".date_time").datetimepicker();

            $(".content_title").on("dblclick",function(){
                $(".content_title").hide();
                $(".content").find("[name='data_content']").show();
            });

            /*选中其中的form元素, 因为之后会使用其监听submit事件*/
            $detail_submit = $(".task_detail").find('form');

            $detail_submit.on("submit",function (e) {
                e.preventDefault();
                var data={};  //定义变量 提取detail信息
                data.value = $(this).find("[name='data_content']").val();
                data.desc = $(this).find("[name='desc']").val();
                data.date = $(this).find("[name='date']").val();
                console.log("data",data);
                update_task(index,data);
                hide_mask()
            })
        }

        function listen_check() {
            $check.on("click",function () {
                var $this = $(this);
                var check_result = $this.prop("checked");
                var index = $this.parent().parent().data("index");

                //判断是否打勾，结果作为result传入task_list
                update_task(index,{result:check_result});

            })
        }


    });
