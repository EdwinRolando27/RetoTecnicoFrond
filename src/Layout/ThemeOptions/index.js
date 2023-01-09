import React from 'react'
import { connect } from 'react-redux'

import {
  setBackgroundColor, setColorScheme, setBackgroundImage, setBackgroundImageOpacity, setEnableBackgroundImage,
  setEnableFixedHeader, setEnableHeaderShadow, setEnableSidebarShadow, setEnableFixedSidebar, setEnableFixedFooter,
  setHeaderBackgroundColor, setEnablePageTitleSubheading, setEnablePageTabsAlt, setEnablePageTitleIcon
} from '../../reducers/ThemeOptions'

const ThemeOptions = props => {
  return <div/>
}

const mapStateToProps = ({ThemeOptions}) => ({
  backgroundColor: ThemeOptions.backgroundColor,
  headerBackgroundColor: ThemeOptions.headerBackgroundColor,

  colorScheme: ThemeOptions.colorScheme,

  enableFixedHeader: ThemeOptions.enableFixedHeader,
  enableHeaderShadow: ThemeOptions.enableHeaderShadow,
  enableSidebarShadow: ThemeOptions.enableSidebarShadow,
  enableFixedSidebar: ThemeOptions.enableFixedSidebar,
  enableFixedFooter: ThemeOptions.enableFixedFooter,

  enablePageTitleIcon: ThemeOptions.enablePageTitleIcon,
  enablePageTitleSubheading: ThemeOptions.enablePageTitleSubheading,
  enablePageTabsAlt: ThemeOptions.enablePageTabsAlt,

  enableBackgroundImage: ThemeOptions.enableBackgroundImage,
  backgroundImage: ThemeOptions.backgroundImage,

  backgroundImageOpacity: ThemeOptions.backgroundImageOpacity
})

const mapDispatchToProps = dispatch => ({
  setEnableBackgroundImage: enable => dispatch(setEnableBackgroundImage(enable)),

  setEnableFixedHeader: enable => dispatch(setEnableFixedHeader(enable)),
  setEnableHeaderShadow: enable => dispatch(setEnableHeaderShadow(enable)),
  setEnableSidebarShadow: enable => dispatch(setEnableSidebarShadow(enable)),
  setEnableFixedFooter: enable => dispatch(setEnableFixedFooter(enable)),
  setEnableFixedSidebar: enable => dispatch(setEnableFixedSidebar(enable)),

  setEnablePageTitleIcon: enable => dispatch(setEnablePageTitleIcon(enable)),
  setEnablePageTitleSubheading: enable => dispatch(setEnablePageTitleSubheading(enable)),
  setEnablePageTabsAlt: enable => dispatch(setEnablePageTabsAlt(enable)),

  setBackgroundImage: image => dispatch(setBackgroundImage(image)),

  setColorScheme: color => dispatch(setColorScheme(color)),

  setBackgroundColor: color => dispatch(setBackgroundColor(color)),

  setHeaderBackgroundColor: color => dispatch(setHeaderBackgroundColor(color)),

  setBackgroundImageOpacity: color => dispatch(setBackgroundImageOpacity(color))
})

export default connect(mapStateToProps, mapDispatchToProps)(ThemeOptions)
