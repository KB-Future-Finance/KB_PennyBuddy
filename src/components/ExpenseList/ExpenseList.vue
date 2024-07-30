<template>
    <div class="container">
        <h1 class="title">거래 내역</h1>
        <div class="filter-buttons">
            <button class="filter-button">기간</button>
            <button class="filter-button">카테고리 ▼</button>
            <button class="filter-button">지출 / 수입 ▼</button>
            <button class="filter-button">전체보기</button>
        </div>
        <table class="expense-table">
            <thead>
                <tr>
                    <th>날짜</th>
                    <th>카테고리</th>
                    <th>지출/수입</th>
                    <th>거래 내역</th>
                    <th>금액</th>
                    <th></th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="record in records" :key="record.record_id">
                    <td>{{ formatDate(record.reg_date) }}</td>
                    <td>{{ record.category_name }}</td>
                    <td>{{ record.category_type }}</td>  
                    <td>{{ record.record_memo }}</td>
                    <td>{{ record.amount }}</td>
                    <td>
                        <button class="edit-button">수정</button>
                        <button class="delete-button">삭제</button>
                    </td>
                </tr>
            </tbody>
        </table>
        <div class="pagination">
            <button @click="fetchRecords(currentPage - 1)" :disabled="currentPage === 1">이전</button>
            <span v-for="page in totalPages" :key="page">
                <button @click="fetchRecords(page)" :class="{ active: page === currentPage }">{{ page }}</button>
            </span>
            <button @click="fetchRecords(currentPage + 1)" :disabled="currentPage === totalPages">다음</button>
        </div>
    </div>
</template>

<script>
import axios from 'axios';

export default {
    name: 'ExpenseList',
    data() {
        return {
            records: [],
            currentPage: 1,
            totalPages: 1
        };
    },
    created() {
        this.fetchRecords();
    },
    methods: {
        fetchRecords(page = 1) {
            axios.get('/api/record/list', {
                params: {
                    page: page,
                    size: 10
                },
                headers: {
                    'Content-Type': 'application/json; charset=utf-8'
                }
            })
            .then(response => {
                this.records = response.data.records;
                this.currentPage = response.data.currentPage;
                this.totalPages = response.data.totalPages;
            })
            .catch(error => {
                console.error('There was an error fetching the records!', error);
            });
        },
        formatDate(date) {
            let d = new Date(date);
            let month = '' + (d.getMonth() + 1);
            let day = '' + d.getDate();
            let year = d.getFullYear();

            if (month.length < 2) month = '0' + month;
            if (day.length < 2) day = '0' + day;

            return [year, month, day].join('-');
        }
    }
};
</script>

<style scoped>
.container {
    padding: 20px;
}

.title {
    font-size: 24px;
    margin-bottom: 20px;
}

.filter-buttons {
    display: flex;
    gap: 10px;
    margin-bottom: 20px;
}

.filter-button {
    background-color: #f08d8d;
    border: none;
    padding: 10px 20px;
    color: white;
    cursor: pointer;
    border-radius: 5px;
}

.expense-table {
    width: 100%;
    border-collapse: collapse;
}

.expense-table th, .expense-table td {
    border: 1px solid #ddd;
    padding: 8px;
    text-align: left;
}

.expense-table th {
    background-color: #f2f2f2;
}

.edit-button, .delete-button {
    background-color: #f08d8d;
    border: none;
    padding: 5px 10px;
    color: white;
    cursor: pointer;
    border-radius: 5px;
    margin-right: 5px;
}

.pagination {
    margin-top: 20px;
    display: flex;
    justify-content: center;
    gap: 5px;
}

.pagination button.active {
    background-color: #f08d8d;
    color: white;
}
</style>
