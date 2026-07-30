const styles = () => ({
  iconContainer: {
    margin: '0 10px 0 0',
    position: 'relative',
    width: 40,
    minWidth: 40,
    height: 40,
    backgroundColor: 'rgba(255, 255, 255, .09)',
    borderRadius: 11,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconFrame: {
    display: 'inline-block',
    width: 24,
    height: 24,
    borderRadius: 7,
    overflow: 'hidden',
  },
  icon: {
    display: 'inline-block',
    width: 24,
    height: 24,
  },
  animationIcon: {
    position: 'absolute',
    top: 0,
    left: 0,
  },
});

export interface AppStoreApplicationLogoClasses {
  iconContainer: string,
  iconFrame: string,
  icon: string,
  animationIcon: string,
}

export default styles;
