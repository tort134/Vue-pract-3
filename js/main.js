Vue.component("plan-work", {
    template: `
    
    `,

    methods:{

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


