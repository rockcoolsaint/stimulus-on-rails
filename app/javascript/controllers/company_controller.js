import { Controller } from "stimulus"
import axios from "axios"

export default class extends Controller {
  static targets = [ "name", "edit", "notice" ]

  initialize() {
    this.getRequest // getrequest
  }

  editWithKeyBoard(e) {
    if (e.keyCode == 13) { // Pressing the ENTER key
      e.preventDefault()
      this.update
    } else if (e.keyCode == 27) { // Pressing the ESC key
      this.editTarget.contentEditable = "false"
      this.noticeTarget.textContent = ""
      axios({
        method: 'GET',
        url: `${this.data.get('url')}.json`
      })
      .then((res) => {
        this.editTarget.textContent = res.data.name
        for(let index in this.nameTargets)
          this.nameTargets[index].textContent = res.data.name
      })
    }
  }

  nameEdit() {
    this.editTarget.contentEditable = "true"
    this.editTarget.focus()
  }

  notice(message) {
    this.noticeTarget.textContent = message
  }

  get update() {
    if (this.editTarget.textContent === "") { // Validate if name is blank
      this.getRequest // getrequest
      return this.notice(`Company name can't be empty.`)
    }
    
    let nameData = {
      company: {
        name: this.editTarget.textContent
      }
    }

    axios({
      method: 'PATCH', 
      url: this.data.get('url'),
      data: nameData,
      headers: {
        'X-CSRF-Token': document.querySelector("meta[name=csrf-token]").content,
        'Content-Type': 'application/json; charset=UTF-8',
        'Accept' : 'application/json'
      }
    })
    .then((res) => {
      if (res.status == 200)
        this.editTarget.textContent = res.data.name

        for(let index in this.nameTargets)
          this.nameTargets[index].textContent = res.data.name
        this.notice('Company name was successfully updated.')
    })
    .catch(function(error) {console.log(error)
    })
  }

  get getRequest() {
    axios({
      method: 'GET',
      url: `${this.data.get('url')}.json`
    })
    .then((res) => {
      this.editTarget.textContent = res.data.name
      for(let index in this.nameTargets)
        this.nameTargets[index].textContent = res.data.name
    })
  }
}
