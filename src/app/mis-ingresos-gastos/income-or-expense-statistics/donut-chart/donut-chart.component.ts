import { Component, ElementRef, Input, SimpleChanges, ViewChild } from '@angular/core';

interface DonutChartData {
  category: string;
  amount: number;
  color: string;
}

@Component({
  selector: 'app-donut-chart',
  standalone: true,
  imports: [],
  templateUrl: './donut-chart.component.html',
  styleUrl: './donut-chart.component.scss'
})
export class DonutChartComponent {

  // Datos del gráfico
  @Input() data: DonutChartData[] = []

  // Tamaño total del svg
  @Input() width = 192
  @Input() height = 192

  @ViewChild('donutChart', { static: true }) svgRef!: ElementRef<SVGElement>
  @ViewChild('tooltip', { static: true }) tooltipRef!: ElementRef<HTMLDivElement>
  
  private svg!: SVGElement
  private tooltip!: HTMLDivElement
  private radius!: number
  private innerRadius!: number
  private total = 0

  constructor() {}
  
  ngOnInit(): void {

    this.svg = this.svgRef.nativeElement
    this.tooltip = this.tooltipRef.nativeElement

    // Tamaño del radio
    this.radius = Math.min(this.width, this.height) / 2

    // Grosor del donut
    this.innerRadius = this.radius * 0.8
    
    // Calcular total y dibujar el gráfico
    if (this.data.length > 0) {
      this.calculateTotal()
      this.drawChart()
    }

  }
  
  ngOnChanges(changes: SimpleChanges): void {

    if (changes['data'] && !changes['data'].firstChange) {

      this.calculateTotal()
      this.clearChart()
      this.drawChart()

    }

  }
  
  private calculateTotal(): void {

    this.total = this.data.reduce((sum, item) => sum + item.amount, 0)
    
  }
  
  calculatePercentage(amount: number): string {
    
    return ((amount / this.total) * 100).toFixed(1)

  }
  
  private clearChart(): void {

    while (this.svg.firstChild) {
      this.svg.removeChild(this.svg.firstChild)
    }

  }
  
  private drawChart(): void {

    const svgns = "http://www.w3.org/2000/svg"
    const g = document.createElementNS(svgns, 'g')
    g.setAttribute('transform', `translate(${this.width / 2}, ${this.height / 2})`)
    this.svg.appendChild(g)
    
    let startAngle = 0
    
    this.data.forEach((item, index) => {

      const angle = (item.amount / this.total) * Math.PI * 2
      const endAngle = startAngle + angle
      
      // Calculate points for the path
      const x1 = this.radius * Math.sin(startAngle)
      const y1 = -this.radius * Math.cos(startAngle)
      const x2 = this.radius * Math.sin(endAngle)
      const y2 = -this.radius * Math.cos(endAngle)
      
      const x1Inner = this.innerRadius * Math.sin(startAngle)
      const y1Inner = -this.innerRadius * Math.cos(startAngle)
      const x2Inner = this.innerRadius * Math.sin(endAngle)
      const y2Inner = -this.innerRadius * Math.cos(endAngle)
      
      const largeArcFlag = angle > Math.PI ? 1 : 0
      
      // Create path for slice
      const path = document.createElementNS(svgns, 'path')

      path.setAttribute('d', `
        M ${x1Inner} ${y1Inner}
        L ${x1} ${y1}
        A ${this.radius} ${this.radius} 0 ${largeArcFlag} 1 ${x2} ${y2}
        L ${x2Inner} ${y2Inner}
        A ${this.innerRadius} ${this.innerRadius} 0 ${largeArcFlag} 0 ${x1Inner} ${y1Inner}
      `)

      path.setAttribute('fill', item.color)
      path.classList.add('slice')
      path.setAttribute('data-index', index.toString())
      
      // Add event listeners for tooltip
      this.addTooltipEvents(path, item)
      
      g.appendChild(path)
      startAngle = endAngle

    })
    
    // Texto del centro
    const centerText = document.createElementNS(svgns, 'text')
    centerText.setAttribute('text-anchor', 'middle')
    centerText.setAttribute('dominant-baseline', 'middle')
    centerText.setAttribute('font-size', '18px')
    centerText.setAttribute('font-weight', 'bold')
    centerText.textContent = 'Total'
    centerText.setAttribute('fill', 'var(--text-primary)') // Color del texto (gris oscuro)
    centerText.setAttribute('y', '-10') // Mover un poco hacia arriba
    g.appendChild(centerText)

    // Suma total del centro
    const totalText = document.createElementNS(svgns, 'text')
    totalText.setAttribute('text-anchor', 'middle')
    totalText.setAttribute('dominant-baseline', 'middle')
    totalText.setAttribute('font-size', '18px')
    totalText.setAttribute('font-weight', 'bold')
    totalText.setAttribute('y', '30')
    totalText.setAttribute('fill', 'var(--text-primary)') // Color del texto
    totalText.setAttribute('y', '20') // Distancia reducida
    totalText.textContent = this.total.toString()

    g.appendChild(totalText)

  }
  
  private addTooltipEvents(path: SVGPathElement, item: DonutChartData): void {

    path.addEventListener('mouseover', (e) => {

      const rect = this.svg.getBoundingClientRect()
      const percentage = ((item.amount / this.total) * 100).toFixed(1)
      
      this.tooltip.innerHTML = `
        <strong>${item.category}</strong><br>
        ${item.amount} (${percentage}%)
      `
      
      this.tooltip.style.opacity = '1'
      this.tooltip.style.left = `${(e as MouseEvent).clientX - rect.left + 10}px`
      this.tooltip.style.top = `${(e as MouseEvent).clientY - rect.top + 10}px`

    })
    
    path.addEventListener('mousemove', (e) => {

      const rect = this.svg.getBoundingClientRect()
      this.tooltip.style.left = `${(e as MouseEvent).clientX - rect.left + 10}px`
      this.tooltip.style.top = `${(e as MouseEvent).clientY - rect.top + 10}px`

    })
    
    path.addEventListener('mouseout', () => {
      this.tooltip.style.opacity = '0'
    })
    
  }

}
