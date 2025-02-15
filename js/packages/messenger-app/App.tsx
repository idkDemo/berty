import React from 'react'
import { IconRegistry } from '@ui-kitten/components'
import { EvaIconsPack } from '@ui-kitten/eva-icons'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { NavigationContainer } from '@react-navigation/native'
import Shake from '@shakebugs/react-native-shake'
import RNBootSplash from 'react-native-bootsplash'

import '@berty-tech/berty-i18n'
import { Provider as ThemeProvider } from '@berty-tech/components/theme'
import { StreamGate, ListGate } from '@berty-tech/components/gates'
import { MessengerProvider, useMountEffect } from '@berty-tech/store'
import { isReadyRef, navigationRef } from '@berty-tech/navigation'
import { Navigation } from '@berty-tech/navigation/stacks'
import { Provider as StyleProvider } from '@berty-tech/styles'
import NotificationProvider from '@berty-tech/components/NotificationProvider'
import { StickMusicPlayer } from '@berty-tech/components/shared-components/StickyMusicPlayer'
import { MusicPlayerProvider } from '@berty-tech/music-player'
import { ErrorScreen } from '@berty-tech/components/error'

import { FeatherIconsPack } from './feather-icons'
import { CustomIconsPack } from './custom-icons'

// TODO: Implement push notif handling on JS
import { NativeModules, NativeEventEmitter } from 'react-native'

const BootSplashInhibitor = () => {
	useMountEffect(() => {
		RNBootSplash.hide({ fade: true })
	})
	return null
}

export const App: React.FC = () => {
	useMountEffect(() => {
		// @ts-ignore
		Shake.start()

		if (NativeModules.EventEmitter) {
			try {
				var eventListener = new NativeEventEmitter(NativeModules.EventEmitter).addListener(
					'onPushReceived',
					data => console.info('FRONT PUSH NOTIF:', data),
				)
				return () => {
					try {
						eventListener.remove() // Unsubscribe from native event emitter
					} catch (e) {
						console.error('Push notif remove listener failed: ' + e)
					}
					isReadyRef.current = false
				}
			} catch (e) {
				console.error('Push notif add listener failed: ' + e)
			}
		}

		return () => {
			isReadyRef.current = false
		}
	})

	return (
		<SafeAreaProvider>
			<StyleProvider>
				<MessengerProvider embedded daemonAddress='http://localhost:1337'>
					<IconRegistry icons={[EvaIconsPack, FeatherIconsPack, CustomIconsPack]} />
					<ThemeProvider>
						<ErrorScreen>
							<NavigationContainer
								ref={navigationRef}
								onReady={() => {
									isReadyRef.current = true
								}}
							>
								<NotificationProvider>
									<BootSplashInhibitor />
									<StreamGate>
										<ListGate>
											<MusicPlayerProvider>
												<StickMusicPlayer />
												<Navigation />
											</MusicPlayerProvider>
										</ListGate>
									</StreamGate>
								</NotificationProvider>
							</NavigationContainer>
						</ErrorScreen>
					</ThemeProvider>
				</MessengerProvider>
			</StyleProvider>
		</SafeAreaProvider>
	)
}

export default App
