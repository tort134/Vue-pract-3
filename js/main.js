const formatter = new Intl.DateTimeFormat('ru', {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric'
})

Vue.component("plan-work", {
    template: `
     <div class="main-menu">
        
        <div class="menu">
            <div class="plan-work card">
                <h2>Планирование задачи</h2>
                <form @submit.prevent>
                    <div class="card-form">
                        <label for="card-title">Заголовок</label>
                        <input v-model="title" type="text" id="card-title">
                    </div>
                    <div class="card-form">
                        <label for="card-desc">Описание</label>
                        <input v-model="description" type="text" id="card-desc">
                    </div>
                    <div class="card-form">
                        <label for="card-deadline">Дэдлайн</label>
                        <input v-model="deadline" type="date" id="card-deadline">
                    </div>
                    <button type="submit" @click="createCard">Создать карточку</button>
                    <p v-if="errors.length">
                        <ul>
                            <li v-for="error in errors">{{ error }}</li>
                        </ul>
                    </p>
                </form>
            </div>
                
            <div v-for="(plan, index) in plans" class="in-plan card">
                <h2>В планах</h2>
                <div class="card-text">
                    <label for="card-title">Заголовок</label>
                    <input v-model="titleEdited" v-if="plan.isEdit" type="text" :placeholder="plan.title">
                    <p v-if="!plan.isEdit">{{ plan.title }}</p>
                </div>
                <div class="card-text">
                    <label for="card-desc">Описание</label>
                    <input v-model="descriptionEdited" v-if="plan.isEdit" type="text" :placeholder="plan.description">
                    <p v-if="!plan.isEdit"> {{ plan.description }} </p>
                </div>
                <div class="card-text">
                    <label for="card-deadline">Дэдлайн</label>
                    <input v-model="deadlineEdited" v-if="plan.isEdit" type="date" :placeholder="plan.deadline">
                    <p v-if="!plan.isEdit">{{ plan.deadline }}</p>
                </div>
                <div class="buttons">
                    <button v-if="!plan.isEdit" @click="goFromPlan(index)" type="submit">Начать выполнение</button>
                    <button v-if="!plan.isEdit" @click="edit(index)">Редактировать</button>
                    <button v-if="plan.isEdit" @click="editAccept(index)" type="submit">Подтвердить изменения</button>
                    <button v-if="plan.isEdit" @click="editCancel(index)" type="submit">Отменить изменения</button>
                    <button @click="deleteCard(index)" type="submit">Удалить карточку</button>
                </div>
                <p>{{time}}</p>
            </div>
        </div>
            
            <div class="menu">
                <div v-for="(work, index) in works" class="in-work card">
                    <h2>В работе</h2>
                    <div class="card-text">
                        <label for="card-title">Заголовок</label>
                        <p>{{ work.title }}</p>
                    </div>
                    <div class="card-text">
                        <label for="card-desc">Описание</label>
                        <p> {{ work.description }} </p>
                    </div>
                    <div class="card-text">
                        <label for="card-deadline">Дэдлайн</label>
                        <p>{{ work.deadline }}</p>
                    </div>
                    <ul>
                        <li v-for="reason in work.reasons">Причина возврата: {{reason}}</li>
                    </ul>
                    <button @click="goTest(index)" type="submit">Подтвердить выполнение</button>
                    <p>{{time}}</p>
                </div>
            </div>
            
            
            <div class="menu">
                <div v-for="(test, index) in tests" class="test card">
                    <h2>Тестирование</h2>
                    <div class="card-text">
                        <label for="card-title">Заголовок</label>
                        <p>{{ test.title }}</p>
                    </div>
                    <div class="card-text">
                        <label for="card-desc">Описание</label>
                        <p> {{ test.description }} </p>
                    </div>
                    <div class="card-text">
                        <label for="card-deadline">Дэдлайн</label>
                        <p>{{ test.deadline }}</p>
                    </div>
                    <ul>
                        <li v-for="reason in test.reasons">Причина возврата: {{reason}}</li>
                    </ul>
                    <input id="clearInp" v-if="test.isReturn" type="text" v-model="reason" >
                    <div class="btns">
                        <button v-if="test.isReturn" @click="goWork(index)" type="submit">Подтвердить</button>
                        <button v-if="test.isReturn" @click="cancelReturn(index)" type="submit">Отменить</button>
                        <button v-if="!test.isReturn" @click="setReason(index)" type="submit">Вернуть задачу</button>
                        <button v-if="!test.isReturn" @click="completeTask(index)" type="submit">Завершить задачу</button>
                    </div>
                    <p>{{time}}</p>
                </div>
            </div>
                
                
                
            <div class="menu">
                <div v-for="(completed, index) in complete" class="test card">
                    <h2>Завершено</h2>
                    <div class="card-text">
                        <label for="card-title">Заголовок</label>
                        <p>{{ completed.title }}</p>
                    </div>
                    <div class="card-text">
                        <label for="card-desc">Описание</label>
                        <p> {{ completed.description }} </p>
                    </div>
                    <ul>
                        <li v-for="reason in completed.reasons">Причина возврата: {{reason}}</li>
                    </ul>
                    <div class="card-text">
                        <label for="card-deadline">Дэдлайн</label>
                        <p>{{ completed.deadline }}</p>
                    </div>
                    <p>{{ isTime }}</p>
                </div>
            </div>
        </div>
    `,

    methods:{
        createCard(){
            if(this.title && this.description && this.deadline){
                let cardInWork = {
                    title: this.title,
                    description: this.description,
                    deadline: this.deadline,
                    reason: null,
                    isEdit: false,
                    isReturn: false,
                    reasons: []
                }

                this.$emit('creating-card', cardInWork)
                this.title = null
                this.description = null
                this.deadline = null

                this.plans.push(cardInWork)
                this.saveData();

                this.errors = [];
            }
            
            else{
               this.errors = [];
                
                if(!this.title){
                    this.errors.push("Title required.")
                }

                if(!this.description){
                    this.errors.push("Description required.")
                }

                if(!this.deadline){
                    this.errors.push("Deadline required.")
                }
            }
        },

        goFromPlan(index){
            let toWork = this.plans.splice(index, 1)[0]

            this.works.push(toWork)
            this.saveData()

       
        },

        goWork(index){
            let toWork = this.tests.splice(index, 1)[0]
            this.works.push(toWork)

            toWork.reasons.push(this.reason)
            this.saveData()

         
        },

        goTest(index){
            let toTest = this.works.splice(index, 1)[0]

            this.tests.push(toTest)

            this.saveData()
            toTest.isReturn = false
            toTest.isReturn = false
        },

        completeTask(index){
            let toComplete = this.tests.splice(index, 1)[0]

            this.complete.push(toComplete)

            if(new Date() > new Date(toComplete.deadline)){
                this.isTime = 'Задача просрочена'
            }

            this.saveData()
        },

        edit(index){
            let plan = this.plans[index]
            plan.isEdit = true
        },

        editAccept(index){
            let plan = this.plans[index]

            if(plan.title !== this.titleEdited && this.titleEdited){
                plan.title = this.titleEdited
            }

            if(plan.description !== this.descriptionEdited && this.descriptionEdited){
                plan.description = this.descriptionEdited
            }

            if(plan.deadline !== this.deadlineEdited && this.deadlineEdited){
                plan.deadline = this.deadlineEdited
            }

            plan.isEdit = false
            this.saveData()
        },

        editCancel(index){
            let plan = this.plans[index]
            plan.isEdit = false

            this.saveData()
        },
        
        deleteCard(index){
            let deleting = this.plans.splice(index, 1)[0]

            this.saveData()
        },

        setReason(index){
            let toTest = this.tests[index]
            toTest.isReturn = true
        },

        cancelReturn(index){
            let toTest = this.tests[index]
            toTest.isReturn = false
        },

        saveData(){
            localStorage.setItem('plans', JSON.stringify(this.plans))
            localStorage.setItem('works', JSON.stringify(this.works))
            localStorage.setItem('tests', JSON.stringify(this.tests))
            localStorage.setItem('complete', JSON.stringify(this.complete))
        }
    },

    data(){
        return {
            title: null,
            description: null,
            deadline: null,
            titleEdited: this.title,
            descriptionEdited: this.description,
            deadlineEdited: this.deadline,
            isEdit: false,
            isReturn: false,
            reason: null,
            date: new Date(),
            isTime: 'Task complete in time',
            reasons: [],
            card: [],
            errors: [],
            plans: [],
            works: [],
            tests: [],
            complete: []
        }
    },

    mounted(){
        this.plans = JSON.parse(localStorage.getItem('plans')) || []
        this.works = JSON.parse(localStorage.getItem('works')) || []
        this.tests = JSON.parse(localStorage.getItem('tests')) || []
        this.complete = JSON.parse(localStorage.getItem('complete')) || []
    },

    computed:{
        time(){
            return formatter.format(this.date)
        },

        beforeMount(){
            this.works = JSON.parse(localStorage.getItem('works'))
            this.reasons = JSON.parse(localStorage.getItem('reasons'))
            this.tests = JSON.parse(localStorage.getItem('tests'))
            this.complete = JSON.parse(localStorage.getItem('complete'))
        }
    }
})

let app = new Vue({
    el: '#app',
    data: {
    }
})
