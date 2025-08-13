import './Header.css'

export const Header = ({title = 'Панель управления', userName = 'Тест Тестов'}) => {
  return (
    <section className='header'>
			<h1>{title}</h1>
			<span className='header_user-name'>{userName}</span>
    </section>
  )
}