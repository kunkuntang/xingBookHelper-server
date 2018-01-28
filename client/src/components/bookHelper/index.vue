<template>
    <component v-bind:is="currentView" @changeView="changeView" :comData="viewData"></component>
</template>
<script>
import ShowAllBookList from './showAllBookList.vue'
import AddBookList from './addBookList.vue'
import CheckBookList from './checkBookList.vue'
import EditBookList from './editBookList.vue'

export default {
        data() {
            return {
                currentView: 'checkBookList',
                viewData: ''
            };
        },
        components: {
            showAllBookList: ShowAllBookList,
            // addBookList: AddBookList,
            checkBookList: CheckBookList,
            editBookList: EditBookList
        },
        methods: {
            changeView (name, data) {
                console.log(name)
                console.log(data)
                if (data) {
                    this.viewData = {
                        bookListName: data.bookListName,
                        belongAcaId: data.belongAcaId,
                        belongMajId: data.belongMajId
                    }
                }
                this.currentView = name
            }
        }
    };
</script>

