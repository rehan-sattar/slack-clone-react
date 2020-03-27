import React from 'react'
import { Progress } from 'semantic-ui-react'

export default function ProgressBar({ uploadPercent, uploadState }) {
  return (
    uploadState === 'UPLOADING' && (
      <Progress
        inverted
        className="progress__bar"
        percent={uploadPercent}
        progress
        indicating
        size="medium"
      />
    )
  )
}
