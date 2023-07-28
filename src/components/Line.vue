<template>
    <div class="line-wrap">
        <Line :data="chartData" :options="chartOptions" />
    </div>
</template>

<script>
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
} from 'chart.js';
import { Line } from 'vue-chartjs';
import dayjs from 'dayjs';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

export default {
    name: 'App',
    props: ['list', 'title'],
    components: {
        Line
    },
    data() {
        return {
            chartData: {
                labels: this.list.map((item) =>
                    dayjs(item.timestamp).format('MM-DD')
                ),
                datasets: [
                    {
                        label: this.title,
                        borderColor: '#1989fa',
                        data: this.list.map((item) => item.price)
                    }
                ]
            },
            chartOptions: {
                responsive: true
            }
        };
    }
};
</script>
<style lang="less" scoped>
.line-wrap {
    height: 215px;
}
</style>
