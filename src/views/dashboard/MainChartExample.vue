<script>
import { Line } from 'vue-chartjs'
import { getStyle, hexToRgba } from '@coreui/coreui/dist/js/coreui-utilities'
import { CustomTooltips } from '@coreui/coreui-plugin-chartjs-custom-tooltips'

function random (min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min)
}

export default {
  extends: Line,
  props: ['height'],
  mounted () {
    const brandSuccess = getStyle('--success') || '#4dbd74'
    const brandInfo = getStyle('--info') || '#20a8d8'
    const brandWarning = getStyle('--warning')

    let elements = 27
    const data1 = []
    const data2 = []
    const data3 = []

    for (let i = 0; i <= elements; i++) {
      data1.push(random(12000, 8000))
      data2.push(random(8400, 4000))
      data3.push(random(4000, 2000))
    }
    this.renderChart({
      labels: ['Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab', 'Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab', 'Dom', 'Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab', 'Dom', 'Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab', 'Dom'],
      datasets: [
        {
          label: 'Envíos totales',
          backgroundColor: hexToRgba(brandInfo, 10),
          borderColor: brandInfo,
          pointHoverBackgroundColor: '#fff',
          borderWidth: 2,
          data: data1
        },
        {
          label: 'Envíos en tránsito',
          backgroundColor: 'transparent',
          borderColor: brandWarning,
          pointHoverBackgroundColor: '#fff',
          borderWidth: 2,
          data: data2
        },
        {
          label: 'Envíos entregados',
          backgroundColor: 'transparent',
          borderColor: brandSuccess,
          pointHoverBackgroundColor: '#fff',
          borderWidth: 2,
          // borderDash: [8, 5],
          data: data3
        }
      ]
    }, {
      tooltips: {
        enabled: false,
        custom: CustomTooltips,
        intersect: true,
        mode: 'index',
        position: 'nearest',
        callbacks: {
          labelColor: function (tooltipItem, chart) {
            return { backgroundColor: chart.data.datasets[tooltipItem.datasetIndex].borderColor }
          }
        }
      },
      maintainAspectRatio: false,
      legend: {
        display: false
      },
      scales: {
        xAxes: [{
          gridLines: {
            drawOnChartArea: false
          }
        }],
        yAxes: [{
          ticks: {
            beginAtZero: true,
            maxTicksLimit: 5,
            stepSize: Math.ceil(1000 / 1),
            max: 12000
          },
          gridLines: {
            display: true
          }
        }]
      },
      elements: {
        point: {
          radius: 0,
          hitRadius: 10,
          hoverRadius: 4,
          hoverBorderWidth: 3
        }
      }
    })
  }
}
</script>
