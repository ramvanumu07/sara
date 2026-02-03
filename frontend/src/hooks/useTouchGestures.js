/**
 * Touch Gestures Hook - Enhanced mobile interactions
 * Provides swipe, pinch, tap, and long press gestures
 */

import { useState, useEffect, useCallback, useRef } from 'react'

const SWIPE_THRESHOLD = 50
const SWIPE_VELOCITY_THRESHOLD = 0.3
const LONG_PRESS_DURATION = 500
const DOUBLE_TAP_DELAY = 300

export const useTouchGestures = (element, options = {}) => {
  const {
    onSwipeLeft,
    onSwipeRight,
    onSwipeUp,
    onSwipeDown,
    onTap,
    onDoubleTap,
    onLongPress,
    onPinch,
    swipeThreshold = SWIPE_THRESHOLD,
    velocityThreshold = SWIPE_VELOCITY_THRESHOLD,
    longPressDuration = LONG_PRESS_DURATION,
    doubleTapDelay = DOUBLE_TAP_DELAY,
    preventDefault = true,
    passive = false
  } = options

  const [isPressed, setIsPressed] = useState(false)
  const [gesture, setGesture] = useState(null)
  
  const touchStart = useRef(null)
  const touchEnd = useRef(null)
  const touchStartTime = useRef(null)
  const longPressTimer = useRef(null)
  const lastTapTime = useRef(0)
  const tapCount = useRef(0)
  const doubleTapTimer = useRef(null)
  const initialDistance = useRef(null)

  // Calculate distance between two touches
  const getDistance = useCallback((touch1, touch2) => {
    const dx = touch1.clientX - touch2.clientX
    const dy = touch1.clientY - touch2.clientY
    return Math.sqrt(dx * dx + dy * dy)
  }, [])

  // Calculate swipe velocity
  const getVelocity = useCallback((distance, time) => {
    return time > 0 ? distance / time : 0
  }, [])

  // Handle touch start
  const handleTouchStart = useCallback((e) => {
    if (preventDefault) e.preventDefault()
    
    const touch = e.touches[0]
    touchStart.current = {
      x: touch.clientX,
      y: touch.clientY
    }
    touchStartTime.current = Date.now()
    setIsPressed(true)
    setGesture('touch_start')

    // Handle multi-touch for pinch
    if (e.touches.length === 2) {
      initialDistance.current = getDistance(e.touches[0], e.touches[1])
    }

    // Start long press timer
    if (onLongPress) {
      longPressTimer.current = setTimeout(() => {
        if (touchStart.current) {
          onLongPress(e)
          setGesture('long_press')
        }
      }, longPressDuration)
    }
  }, [preventDefault, onLongPress, longPressDuration, getDistance])

  // Handle touch move
  const handleTouchMove = useCallback((e) => {
    if (preventDefault) e.preventDefault()
    
    if (!touchStart.current) return

    // Clear long press timer on move
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current)
      longPressTimer.current = null
    }

    // Handle pinch gesture
    if (e.touches.length === 2 && initialDistance.current && onPinch) {
      const currentDistance = getDistance(e.touches[0], e.touches[1])
      const scale = currentDistance / initialDistance.current
      onPinch({ scale, distance: currentDistance, initialDistance: initialDistance.current })
      setGesture('pinch')
      return
    }

    const touch = e.touches[0]
    touchEnd.current = {
      x: touch.clientX,
      y: touch.clientY
    }

    const deltaX = touchEnd.current.x - touchStart.current.x
    const deltaY = touchEnd.current.y - touchStart.current.y
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY)

    if (distance > 10) {
      setGesture('moving')
    }
  }, [preventDefault, onPinch, getDistance])

  // Handle touch end
  const handleTouchEnd = useCallback((e) => {
    if (preventDefault) e.preventDefault()
    
    setIsPressed(false)
    
    // Clear long press timer
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current)
      longPressTimer.current = null
    }

    if (!touchStart.current) return

    const touchEndTime = Date.now()
    const touchDuration = touchEndTime - touchStartTime.current

    // Handle tap gestures if no significant movement
    if (!touchEnd.current || gesture === 'touch_start') {
      const currentTime = Date.now()
      
      // Check for double tap
      if (onDoubleTap && currentTime - lastTapTime.current < doubleTapDelay) {
        tapCount.current += 1
        
        if (tapCount.current === 2) {
          if (doubleTapTimer.current) {
            clearTimeout(doubleTapTimer.current)
          }
          onDoubleTap(e)
          setGesture('double_tap')
          tapCount.current = 0
          lastTapTime.current = 0
        }
      } else {
        tapCount.current = 1
        lastTapTime.current = currentTime
        
        // Set timer for single tap
        if (onTap) {
          doubleTapTimer.current = setTimeout(() => {
            if (tapCount.current === 1) {
              onTap(e)
              setGesture('tap')
            }
            tapCount.current = 0
          }, onDoubleTap ? doubleTapDelay : 0)
        }
      }
    } else if (touchEnd.current) {
      // Handle swipe gestures
      const deltaX = touchEnd.current.x - touchStart.current.x
      const deltaY = touchEnd.current.y - touchStart.current.y
      const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY)
      const velocity = getVelocity(distance, touchDuration)

      if (distance >= swipeThreshold && velocity >= velocityThreshold) {
        const absDeltaX = Math.abs(deltaX)
        const absDeltaY = Math.abs(deltaY)

        if (absDeltaX > absDeltaY) {
          // Horizontal swipe
          if (deltaX > 0 && onSwipeRight) {
            onSwipeRight({ deltaX, deltaY, distance, velocity, duration: touchDuration })
            setGesture('swipe_right')
          } else if (deltaX < 0 && onSwipeLeft) {
            onSwipeLeft({ deltaX, deltaY, distance, velocity, duration: touchDuration })
            setGesture('swipe_left')
          }
        } else {
          // Vertical swipe
          if (deltaY > 0 && onSwipeDown) {
            onSwipeDown({ deltaX, deltaY, distance, velocity, duration: touchDuration })
            setGesture('swipe_down')
          } else if (deltaY < 0 && onSwipeUp) {
            onSwipeUp({ deltaX, deltaY, distance, velocity, duration: touchDuration })
            setGesture('swipe_up')
          }
        }
      }
    }

    // Reset touch tracking
    touchStart.current = null
    touchEnd.current = null
    touchStartTime.current = null
    initialDistance.current = null
    
    // Clear gesture after a delay
    setTimeout(() => setGesture(null), 100)
  }, [
    preventDefault, gesture, onDoubleTap, doubleTapDelay, onTap, onSwipeRight, 
    onSwipeLeft, onSwipeDown, onSwipeUp, swipeThreshold, velocityThreshold, getVelocity
  ])

  // Attach event listeners
  useEffect(() => {
    const el = element?.current || element
    if (!el) return

    const options = { passive: passive }
    
    el.addEventListener('touchstart', handleTouchStart, options)
    el.addEventListener('touchmove', handleTouchMove, options)
    el.addEventListener('touchend', handleTouchEnd, options)

    return () => {
      el.removeEventListener('touchstart', handleTouchStart)
      el.removeEventListener('touchmove', handleTouchMove)
      el.removeEventListener('touchend', handleTouchEnd)
    }
  }, [element, handleTouchStart, handleTouchMove, handleTouchEnd, passive])

  // Cleanup timers on unmount
  useEffect(() => {
    return () => {
      if (longPressTimer.current) {
        clearTimeout(longPressTimer.current)
      }
      if (doubleTapTimer.current) {
        clearTimeout(doubleTapTimer.current)
      }
    }
  }, [])

  return {
    isPressed,
    gesture,
    // Utility functions
    clearGesture: () => setGesture(null)
  }
}

export default useTouchGestures