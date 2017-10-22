
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
        visibility:'all',
        page:{
            total:'',
            index:1  //当前第几页
        }
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
            console.log(filter[this.visibility](this.list).length);
            this.page.total = filter[this.visibility](this.list).length;
            console.log(this.page.index)
            return (filter[this.visibility]?filter[this.visibility](this.list):this.list).slice((this.page.index - 1) * 10, (this.page.index) * 10)
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
        editedTodo:function(todo){
            
            this.editingTodo = "";
            
        },
        cancelTodo:function(todo){
            todo.title = this.beforeTodo;
            this.beforeTodo = "";
        },
        clear:function(){
            
        },
        handleSizeChange:function(val){
            console.log(`每页${val}条`)
        },
        handleCurrentChange(val) {
            console.log(`当前页: ${val}`);
            this.page.index = val;
        },
        clear:function(){
            console.log('clear');
            console.log(this.list);
            this.list = (this.list).filter(function(item){
                return !item.checked
            })
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



