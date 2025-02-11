Vue.component("plan-work", {
    template: `
    
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
                this.errors.pop()
                this.errors.pop()
                this.errors.pop()
            }
            
            else{
                this.errors.pop()
                this.errors.pop()
                this.errors.pop()
                
                if(!this.title) {
                    this.errors.push("Title required.")
                }

                if(!this.description) {
                    this.errors.push("Description required.")
                }

                if(!this.deadline) {
                    this.errors.push("Deadline required.")
                }
            }
        },

        goFromPlan(index) {
            let toWork = this.plans.splice(index, 1)[0]

            this.works.push(toWork)

            localStorage.setItem('works', JSON.stringify(this.works))
            localStorage.setItem('tests', JSON.stringify(this.tests))
            localStorage.setItem('complete', JSON.stringify(this.complete))
        },

        goWork(index) {
            let toWork = this.tests.splice(index, 1)[0]
            this.works.push(toWork)

            toWork.reasons.push(this.reason)

            localStorage.setItem('reasons', JSON.stringify(toWork.reasons))
            localStorage.setItem('works', JSON.stringify(this.works))
            localStorage.setItem('tests', JSON.stringify(this.tests))
            localStorage.setItem('complete', JSON.stringify(this.complete))
        },

        goTest(index){
            let toTest = this.works.splice(index, 1)[0]

            this.tests.push(toTest)

            localStorage.setItem('works', JSON.stringify(this.works))
            localStorage.setItem('tests', JSON.stringify(this.tests))
            localStorage.setItem('complete', JSON.stringify(this.complete))
            toTest.isReturn = false
        },

        completeTask(index) {
            let toComplete = this.tests.splice(index, 1)[0]

            this.complete.push(toComplete)

            if(new Date() > new Date(toComplete.deadline)){
                this.isTime = 'Задача просрочена'
            }

            localStorage.setItem('works', JSON.stringify(this.works))
            localStorage.setItem('tests', JSON.stringify(this.tests))
            localStorage.setItem('complete', JSON.stringify(this.complete))
        },

        edit(index) {
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
        },
        editCancel(index){
            let plan = this.plans[index]
            plan.isEdit = false
        },
        
        deleteCard(index){
            let deleting = this.plans.splice(index, 1)[0]
        },

        setReason(index){
            let toTest = this.tests[index]
            toTest.isReturn = true
        },

        cancelReturn(index){
            let toTest = this.tests[index]
            toTest.isReturn = false
        }
    },
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


