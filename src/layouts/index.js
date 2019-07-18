import BasicLayout from './BasicLayout';
import UserLayout from './UserLayout';

export default function(props) {
    if (props.location.pathname === '/login') {
      return <UserLayout {...props}>{ props.children }</UserLayout>
    }
  
    return <BasicLayout {...props}>{ props.children }</BasicLayout>
}