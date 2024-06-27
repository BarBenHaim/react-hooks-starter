import { MailList } from '../cmps/MailList.jsx'
import { MailFilter } from '../cmps/MailFilter.jsx'
import { MailModal } from '../cmps/MailModal.jsx'
import { MailFolder } from '../cmps/MailFolderList.jsx'

import { mailService } from '../services/mail.service.js'

const { useParams, Outlet } = ReactRouterDOM
const { useState, useEffect } = React

const loggedinUser = {
  email: 'fakironir@gmail.com',
  fullname: 'Mahatma Appsus',
}

export function MailIndex() {
  const params = useParams()
  const [mails, setMails] = useState(null)
  const [filterMail, setfilterMail] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(null)
  const mailId = params.mailId

  useEffect(() => {
    mailService.query().then((mails) => {
      setMails(mails)
      setfilterMail(mails)

      const filteredMails = mails.filter(
        (mail) => mail.from !== loggedinUser.email
      )
      setfilterMail(filteredMails)
    })
  }, [])

  function getInbox() {
    const filteredMails = mails.filter(
      (mail) => mail.from !== loggedinUser.email
    )

    setfilterMail(filteredMails)
    return filteredMails
  }

  function onRemoveMail(ev, mailId) {
    ev.preventDefault()
    mailService
      .remove(mailId)
      .then(() => {
        setMails((prevMail) => prevMail.filter((mail) => mail.id !== mailId))
      })
      .catch((err) => {
        console.log('err:', err)
      })
  }

  function filretSentMails(mails) {
    const filteredMails = mails.filter(
      (mail) => mail.from === loggedinUser.email
    )
    setfilterMail(filteredMails)
    return filteredMails
  }

  function filterStarMails() {
    const starMails = mails.filter((mail) => mail.isStar)
    setfilterMail(starMails)
    return starMails
  }
  function onStar(ev, mailId) {
    ev.preventDefault()
    setMails((prevMails) =>
      prevMails.map((mail) =>
        mail.id === mailId ? (mail.isStar = true) : (mail.isStar = false)
      )
    )
    console.log(mails)
  }

  function onRead(mailId) {
    mails.map((mail) => {
      if (mail.id === mailId) {
        mail.isRead = true
      }
      return mails
    })
  }

  function onNewMail() {
    setIsModalOpen(true)
  }

  function closeModal() {
    setIsModalOpen(false)
  }

  if (!mails) return <div>Loading...</div>
  return (
    <section className="mail-layout">
      <MailFilter />
      <MailFolder
        mails={mails}
        onNewMail={onNewMail}
        filretSentMails={filretSentMails}
        getInbox={getInbox}
        filterStarMails={filterStarMails}
      />

      {!mailId && (
        <MailList
          mails={filterMail}
          onRemoveMail={onRemoveMail}
          onRead={onRead}
          onStar={onStar}
        />
      )}
      {mailId && <Outlet />}
      {isModalOpen && (
        <MailModal
          closeModal={closeModal}
          crateMail={mailService.createNewMail}
        />
      )}
    </section>
  )
}
