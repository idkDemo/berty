import React, { useState } from 'react'
import { View, ScrollView } from 'react-native'
import { Layout, Input } from '@ui-kitten/components'
import { useTranslation } from 'react-i18next'
import { withInAppNotification } from 'react-native-in-app-notification'

import { useStyles } from '@berty-tech/styles'
import { ScreenFC } from '@berty-tech/navigation'
import {
	useMessengerContext,
	useThemeColor,
	servicesAuthViaURL,
	servicesAuthViaDefault,
	useAccountServices,
	serviceNames,
} from '@berty-tech/store'

import { ButtonSetting, FactionButtonSetting } from '../shared-components'
import { showNeedRestartNotification } from '../helpers'

const BodyServicesAuth = withInAppNotification(({ showNotification }: any) => {
	const [{ flex, padding, margin }] = useStyles()
	const colors = useThemeColor()
	const { t }: any = useTranslation()

	const [url, setURL] = useState('')
	const ctx = useMessengerContext()
	const accountServices = useAccountServices()

	return (
		<View style={[flex.tiny, padding.medium, margin.bottom.medium]}>
			<ButtonSetting
				name={t('settings.services-auth.operated-services-button')}
				icon='plus-circle-outline'
				iconSize={30}
				iconColor={colors['background-header']}
				alone={true}
				onPress={async () => {
					await servicesAuthViaDefault(ctx)
				}}
			/>
			<FactionButtonSetting
				name={t('settings.services-auth.register-service-button.title')}
				icon='plus-circle-outline'
				iconSize={30}
				iconColor={colors['background-header']}
				style={[margin.top.medium]}
			>
				<Input
					textContentType={'URL'}
					autoCorrect={false}
					autoCapitalize={'none'}
					value={url}
					placeholder={t('settings.services-auth.register-service-button.input-placeholder')}
					onChange={({ nativeEvent }) => {
						setURL(nativeEvent.text)
					}}
				/>
				<ButtonSetting
					name={t('settings.services-auth.register-service-button.action')}
					iconSize={30}
					iconColor={colors['background-header']}
					alone={false}
					onPress={async () => {
						try {
							await servicesAuthViaURL(ctx, url)
							showNeedRestartNotification(showNotification, ctx, t)
						} catch (e) {
							// ignoring
						}
					}}
				/>
			</FactionButtonSetting>
			<FactionButtonSetting
				name={t('settings.services-auth.registered-services-button.title')}
				icon='cube-outline'
				iconSize={30}
				iconColor={colors['background-header']}
				style={[margin.top.medium]}
			>
				{accountServices.length === 0 ? (
					<ButtonSetting
						name={t('settings.services-auth.registered-services-button.sample-no-services')}
						disabled
						alone={false}
					/>
				) : (
					accountServices.map(a => {
						return (
							<ButtonSetting
								key={`${a.tokenId}-${a.serviceType}`}
								name={`${
									(typeof a.serviceType === 'string' && serviceNames[a.serviceType]) ||
									t('settings.services-auth.registered-services-button.sample-unknown-service')
								}\n${a.authenticationUrl}`}
								disabled
								alone={false}
							/>
						)
					})
				)}
			</FactionButtonSetting>
		</View>
	)
})

export const ServicesAuth: ScreenFC<'Settings.ServicesAuth'> = () => {
	const colors = useThemeColor()

	return (
		<Layout style={{ flex: 1, backgroundColor: colors['main-background'] }}>
			<ScrollView bounces={false}>
				<BodyServicesAuth />
			</ScrollView>
		</Layout>
	)
}
