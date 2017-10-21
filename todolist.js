// var list = [{
//     title:"吃饭",
//     checked:false
// },{
//     title:"喝水",
//     checked:false    
// },{
//     title:"早餐",
//     checked:false
// },{
//     title:"厕所",
//     checked:false
// }];

var setLocal = {
    save(key,value){
        localStorage.setItem(key,JSON.stringify(value))
    },
    get(key){
        return JSON.parse(localStorage.getItem(key))
    }
}
var list = setLocal.get("todos") || [];
var num = list.filter(function(todo){
    return !todo.checked
}).length

var vm = new Vue({
    el:".main",
    data:{
        list:list,
        todo:'',
        editingTodo:"",
        beforeTodo:"",
        getChecked:num,
        visibility:'all'
    },
    watch:{
        list:{
            handler:function(){
                this.getChecked = list.filter(function(todo){
                    return !todo.checked
                }).length
                setLocal.save("todos",this.list)
            },
            deep:true
        }
    },
    computed:{
        filterList:function(){
            // this.visibility = 'all'
            var filter = {
                all:function(list){
                    return list
                },
                unfinish:function(list){
                    return list.filter(function(item){
                        return !item.checked;
                    })
                },
                finished:function(list){
                    return list.filter(function(item){
                        return item.checked
                    })
                }
            }
            return filter[this.visibility]?filter[this.visibility](this.list):this.list
            
        }
    },
    methods:{
        addTodo:function(){
            if(this.todo){
                this.list.push({
                    title:this.todo,
                    checked:false
                });
                this.todo = '';
            }
        },
        deleteTodo:function(todo){
            var index = this.list.indexOf(todo);
            this.list.splice(index,1)
        },
        editTodo:function(todo){
            // console.log(todo)
            this.editingTodo = todo;
            this.beforeTodo = todo.title;
        },
        editedTodo:function(){
            this.editingTodo = ""
        },
        cancelTodo:function(todo){
            todo.title = this.beforeTodo;
            this.beforeTodo = "";
        }
        
    },
    directives:{
        focus:{
            update(el,binding){
                if(binding.value){
                    el.focus()
                }
            }
        }
    }
})



function changeHash(){
    var hash = window.location.hash.slice(1);
    vm.visibility = hash;
}
changeHash()
window.addEventListener('hashchange',changeHash)
