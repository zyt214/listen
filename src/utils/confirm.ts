import { createApp, defineComponent, h, ref } from 'vue'

interface ConfirmOptions {
    title?: string
    content: string
    okText?: string
    cancelText?: string
    onOk?: () => void | Promise<void>
    onCancel?: () => void
}

export function showConfirm(options: ConfirmOptions): void {
    const {
        title = '提示',
        content,
        okText = '确定',
        cancelText = '取消',
        onOk,
        onCancel
    } = options

    const container = document.createElement('div')
    document.body.appendChild(container)

    const destroy = () => {
        app.unmount()
        document.body.removeChild(container)
    }

    const handleCancel = () => {
        onCancel?.()
        destroy()
    }

    const handleOk = async () => {
        await onOk?.()
        destroy()
    }

    const ConfirmDialog = defineComponent({
        setup() {
            const visible = ref(true)
            return () =>
                visible.value
                    ? h(
                          'div',
                          {
                              style: {
                                  position: 'fixed',
                                  inset: '0',
                                  zIndex: '9999',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  padding: '24px'
                              }
                          },
                          [
                              // 遮罩层
                              h('div', {
                                  style: {
                                      position: 'absolute',
                                      inset: '0',
                                      background: 'rgba(0,0,0,0.45)',
                                      backdropFilter: 'blur(2px)'
                                  },
                                  onClick: handleCancel
                              }),
                              // 弹窗
                              h(
                                  'div',
                                  {
                                      style: {
                                          position: 'relative',
                                          width: '100%',
                                          maxWidth: '320px',
                                          background: '#ffffff',
                                          borderRadius: '20px',
                                          padding: '32px 24px 24px',
                                          boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
                                          textAlign: 'center'
                                      }
                                  },
                                  [
                                      // 标题
                                      h(
                                          'div',
                                          {
                                              style: {
                                                  fontSize: '17px',
                                                  fontWeight: '700',
                                                  color: '#1e293b',
                                                  marginBottom: '12px'
                                              }
                                          },
                                          title
                                      ),
                                      // 内容
                                      h(
                                          'div',
                                          {
                                              style: {
                                                  fontSize: '15px',
                                                  color: '#475569',
                                                  lineHeight: '1.6',
                                                  marginBottom: '28px'
                                              }
                                          },
                                          content
                                      ),
                                      // 按钮行
                                      h(
                                          'div',
                                          {
                                              style: {
                                                  display: 'flex',
                                                  gap: '12px'
                                              }
                                          },
                                          [
                                              // 取消按钮
                                              h(
                                                  'button',
                                                  {
                                                      style: {
                                                          flex: '1',
                                                          height: '48px',
                                                          borderRadius: '80px',
                                                          border: '1.5px solid #e2e8f0',
                                                          background: '#ffffff',
                                                          color: '#475569',
                                                          fontSize: '15px',
                                                          fontWeight: '500',
                                                          cursor: 'pointer',
                                                          transition: 'all 0.2s'
                                                      },
                                                      onClick: handleCancel,
                                                      onMouseenter: (e: MouseEvent) => {
                                                          ;(e.target as HTMLElement).style.background = '#f8fafc'
                                                      },
                                                      onMouseleave: (e: MouseEvent) => {
                                                          ;(e.target as HTMLElement).style.background = '#ffffff'
                                                      }
                                                  },
                                                  cancelText
                                              ),
                                              // 确认按钮
                                              h(
                                                  'button',
                                                  {
                                                      style: {
                                                          flex: '1',
                                                          height: '48px',
                                                          borderRadius: '80px',
                                                          border: 'none',
                                                          background:
                                                              'linear-gradient(90deg, rgba(123,104,255,0.9) 0%, rgba(51,112,255,0.9) 100%)',
                                                          color: '#ffffff',
                                                          fontSize: '15px',
                                                          fontWeight: '600',
                                                          cursor: 'pointer',
                                                          transition: 'opacity 0.2s'
                                                      },
                                                      onClick: handleOk,
                                                      onMouseenter: (e: MouseEvent) => {
                                                          ;(e.target as HTMLElement).style.opacity = '0.88'
                                                      },
                                                      onMouseleave: (e: MouseEvent) => {
                                                          ;(e.target as HTMLElement).style.opacity = '1'
                                                      }
                                                  },
                                                  okText
                                              )
                                          ]
                                      )
                                  ]
                              )
                          ]
                      )
                    : null
        }
    })

    const app = createApp(ConfirmDialog)
    app.mount(container)
}
