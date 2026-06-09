import { Component } from 'react'
import { ServerError } from '@/components/common/ServerError'

export class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error, info) {
    console.error('ErrorBoundary caught:', error, info)
  }

  handleRetry = () => {
    this.setState({ hasError: false })
    this.props.onReset?.()
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback ?? (
        <div className="p-6">
          <ServerError onRetry={this.handleRetry} message="An unexpected error occurred in this section." />
        </div>
      )
    }

    return this.props.children
  }
}
