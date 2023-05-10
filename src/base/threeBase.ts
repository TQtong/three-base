/*
 * @Author: TQtong 2733707740@qq.com
 * @Date: 2023-05-08 08:33:51
 * @LastEditors: TQtong 2733707740@qq.com
 * @LastEditTime: 2023-05-09 20:59:22
 * @FilePath: \xin-meng-he-project\src\base\threeBase.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { Scene, PerspectiveCamera, WebGLRenderer, Vector2, AxesHelper } from 'three'
// 导入轨道控制器
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
// 导入后期效果合成器
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer'
// three框架本身自带效果
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass'
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass'
import { threeClass } from '@/types/threeObj'

export default class ThreeBase implements threeClass {
    element: HTMLDivElement
    width: number
    height: number

    sence!: Scene
    camera!: PerspectiveCamera
    renderer!: WebGLRenderer
    control!: OrbitControls
    effectComposer!: EffectComposer
    unrealBloomPass!: UnrealBloomPass

    constructor (element: HTMLDivElement) {
      this.element = element
      this.width = window.innerWidth
      this.height = window.innerHeight
      this.init()
    }

    private init () {
      this.initSence()
      this.initCamera()
      this.initRenderer()
      this.initControl()
      this.initEffect()
    }

    private initSence () {
      this.sence = new Scene()
    }

    private initCamera () {
      this.camera = new PerspectiveCamera(45,
        this.width / this.height,
        0.1,
        10000)
      this.camera.position.set(0, 0, 10)
      // update camera matrix
      this.camera.updateProjectionMatrix()
    }

    private initRenderer () {
      this.renderer = new WebGLRenderer({
        antialias: true,
        logarithmicDepthBuffer: true
      }) // 抗锯齿、深度缓存
      this.renderer.setSize(this.width, this.height)
      this.element.appendChild(this.renderer.domElement)
    }

    private initControl () {
      this.control = new OrbitControls(this.camera, this.renderer.domElement)
    }

    private initEffect () {
      // effect composer
      this.effectComposer = new EffectComposer(this.renderer)
      this.effectComposer.setSize(this.width, this.height)

      // add render pass
      const renderPass = new RenderPass(this.sence, this.camera)
      this.effectComposer.addPass(renderPass)

      // add unreal bloom pass
      this.unrealBloomPass = new UnrealBloomPass(new Vector2(this.width, this.height), 1.5, 0.4, 0.85)
      this.effectComposer.addPass(this.unrealBloomPass)
    }

    public addAxis () {
      const axis = new AxesHelper(20)
      this.sence.add(axis)
    }

    public render () {
      this.control.update()
      this.effectComposer.render()
      requestAnimationFrame(this.render.bind(this))
    }
}
