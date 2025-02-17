// @flow

import FieldText from '@atlaskit/field-text';
import ArrowLeft from '@atlaskit/icon/glyph/arrow-left';
import { AkCustomDrawer } from '@atlaskit/navigation';
import { SpotlightTarget } from '@atlaskit/onboarding';
import Panel from '@atlaskit/panel';

import React, { Component } from 'react';
import { withTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import type { Dispatch } from 'redux';
import { compose } from 'redux';
import { push } from 'react-router-redux';

import { closeDrawer, DrawerContainer, Logo } from '../../navbar';
import { Onboarding, advenaceSettingsSteps, startOnboarding } from '../../onboarding';
import { Form, SettingsContainer, TogglesContainer, SignOutButton } from '../styled';
import {
    setEmail, setName, setWindowAlwaysOnTop,
    setStartWithAudioMuted, setStartWithVideoMuted, setDisableAGC
} from '../actions';

import SettingToggle from './SettingToggle';
import ServerURLField from './ServerURLField';
import ServerTimeoutField from './ServerTimeoutField';
import { updateAccessToken, updateUserInfo } from '../../login-page/action';
import { ThirdPartyFromType } from '../../login-page/type/types.js';
import { openDrawer } from '../../navbar/actions.js';
type Props = {

    /**
     * Redux dispatch.
     */
    dispatch: Dispatch<*>;

    /**
     * Is the drawer open or not.
     */
    isOpen: boolean;

    /**
     * Email of the user.
     */
    _email: string;

    /**
     * Whether onboarding is active or not.
     */
    _isOnboardingAdvancedSettings: boolean,

    /**
     * Name of the user.
     */
    _name: string;

    /**
     * I18next translation function.
     */
    t: Function;
};

/**
 * Drawer that open when SettingsAction is clicked.
 */
class SettingsDrawer extends Component<Props, *> {
    /**
     * Initializes a new {@code SettingsDrawer} instance.
     *
     * @inheritdoc
     */
    constructor(props) {
        super(props);

        this._onBackButton = this._onBackButton.bind(this);
        this._onEmailBlur = this._onEmailBlur.bind(this);
        this._onEmailFormSubmit = this._onEmailFormSubmit.bind(this);
        this._onNameBlur = this._onNameBlur.bind(this);
        this._onNameFormSubmit = this._onNameFormSubmit.bind(this);
        this._onClickSignOut = this._onClickSignOut.bind(this);
    }

    /**
     * Start Onboarding once component is mounted.
     *
     * NOTE: It automatically checks if the onboarding is shown or not.
     *
     * @param {Props} prevProps - Props before component updated.
     * @returns {void}
     */
    componentDidUpdate(prevProps: Props) {
        if (!prevProps.isOpen && this.props.isOpen) {

            // TODO - Find a better way for this.
            // Delay for 300ms to let drawer open.
            setTimeout(() => {
                this.props.dispatch(startOnboarding('settings-drawer'));
            }, 300);
        }
    }

    /**
     * Render function of component.
     *
     * @returns {ReactElement}
     */
    render() {
        const { t } = this.props;

        return (
            <AkCustomDrawer
                backIcon = { <ArrowLeft label = { t('settings.back') } /> }
                isOpen = { this.props.isOpen }
                onBackButton = { this._onBackButton }
                primaryIcon = { <Logo /> } >
                <DrawerContainer>
                    <SettingsContainer>
                        <SpotlightTarget
                            name = 'name-setting'>
                            <Form onSubmit = { this._onNameFormSubmit }>
                                <FieldText
                                    label = { t('settings.name') }
                                    onBlur = { this._onNameBlur }
                                    shouldFitContainer = { true }
                                    type = 'text'
                                    value = { this.props._name } />
                            </Form>
                        </SpotlightTarget>
                        <SpotlightTarget
                            name = 'email-setting'>
                            <Form onSubmit = { this._onEmailFormSubmit }>
                                <FieldText
                                    label = { t('settings.email') }
                                    onBlur = { this._onEmailBlur }
                                    shouldFitContainer = { true }
                                    type = 'text'
                                    value = { this.props._email } />
                            </Form>
                        </SpotlightTarget>
                        <TogglesContainer>
                            <SpotlightTarget
                                name = 'start-muted-toggles'>
                                <SettingToggle
                                    label = { t('settings.startWithAudioMuted') }
                                    settingChangeEvent = { setStartWithAudioMuted }
                                    settingName = 'startWithAudioMuted' />
                                <SettingToggle
                                    label = { t('settings.startWithVideoMuted') }
                                    settingChangeEvent = { setStartWithVideoMuted }
                                    settingName = 'startWithVideoMuted' />
                            </SpotlightTarget>
                        </TogglesContainer>
                        <Panel
                            header = { t('settings.advancedSettings') }
                            isDefaultExpanded = { this.props._isOnboardingAdvancedSettings }>
                            <SpotlightTarget name = 'server-setting'>
                                <ServerURLField />
                            </SpotlightTarget>
                            <SpotlightTarget name = 'server-timeout'>
                                <ServerTimeoutField />
                            </SpotlightTarget>
                            <TogglesContainer>
                                <SpotlightTarget
                                    name = 'always-on-top-window'>
                                    <SettingToggle
                                        label = { t('settings.alwaysOnTopWindow') }
                                        settingChangeEvent = { setWindowAlwaysOnTop }
                                        settingName = 'alwaysOnTopWindowEnabled' />
                                </SpotlightTarget>
                                <SettingToggle
                                    label = { t('settings.disableAGC') }
                                    settingChangeEvent = { setDisableAGC }
                                    settingName = 'disableAGC' />
                            </TogglesContainer>
                        </Panel>
                        <Onboarding section = 'settings-drawer' />
                        <SignOutButton onClick = { this._onClickSignOut }>Sign Out</SignOutButton>
                    </SettingsContainer>
                </DrawerContainer>
            </AkCustomDrawer>
        );
    }


    _onBackButton: (*) => void;

    /**
     * Closes the drawer when back button is clicked.
     *
     * @returns {void}
     */
    _onBackButton() {
        this.props.dispatch(closeDrawer());
    }

    _onEmailBlur: (*) => void;

    /**
     * Updates email in (redux) state when email is updated.
     *
     * @param {SyntheticInputEvent<HTMLInputElement>} event - Event by which
     * this function is called.
     * @returns {void}
     */
    _onEmailBlur(event: SyntheticInputEvent<HTMLInputElement>) {
        this.props.dispatch(setEmail(event.currentTarget.value));
    }

    _onEmailFormSubmit: (*) => void;

    /**
     * Prevents submission of the form and updates email.
     *
     * @param {SyntheticEvent<HTMLFormElement>} event - Event by which
     * this function is called.
     * @returns {void}
     */
    _onEmailFormSubmit(event: SyntheticEvent<HTMLFormElement>) {
        event.preventDefault();

        // $FlowFixMe
        this.props.dispatch(setEmail(event.currentTarget.elements[0].value));
    }

    _onNameBlur: (*) => void;

    /**
     * Updates name in (redux) state when name is updated.
     *
     * @param {SyntheticInputEvent<HTMLInputElement>} event - Event by which
     * this function is called.
     * @returns {void}
     */
    _onNameBlur(event: SyntheticInputEvent<HTMLInputElement>) {
        this.props.dispatch(setName(event.currentTarget.value));
    }

    _onNameFormSubmit: (*) => void;

    /**
     * Prevents submission of the form and updates name.
     *
     * @param {SyntheticEvent<HTMLFormElement>} event - Event by which
     * this function is called.
     * @returns {void}
     */
    _onNameFormSubmit(event: SyntheticEvent<HTMLFormElement>) {
        event.preventDefault();

        // $FlowFixMe
        this.props.dispatch(setName(event.currentTarget.elements[0].value));
    }

    /**
     * User sign out.
     *
     * @returns {void}
     */
    _onClickSignOut() {
        localStorage.setItem('ACCESS_TOKEN', '');
        localStorage.setItem('USER_INFO', '');
        this.props.dispatch(updateAccessToken(''));
        this.props.dispatch(updateUserInfo({
            displayName: '',
            email: '',
            id: '',
            picture: '',
            thirdPartyFrom: ThirdPartyFromType.google,
            thirdPartyId: ''
        }));
        this.props.dispatch(openDrawer(undefined));
        this.props.dispatch(push('/login'));
    }
}

/**
 * Maps (parts of) the redux state to the React props.
 *
 * @param {Object} state - The redux state.
 * @returns {Props}
 */
function _mapStateToProps(state: Object) {
    return {
        _email: state.settings.email,
        _isOnboardingAdvancedSettings: !advenaceSettingsSteps.every(i => state.onboarding.onboardingShown.includes(i)),
        _name: state.settings.name
    };
}

export default compose(connect(_mapStateToProps), withTranslation())(SettingsDrawer);
