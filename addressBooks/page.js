var ui = {};
for (let element of document.querySelectorAll("[id]")) {
	ui[element.id] = element;
}

ui.reload.onclick = function() {
	location.reload();
};
ui.open.onclick = function() {
	browser.addressBooks.openUI();
};

ui.addressBooks.onclick = async function(event) {
	ui.contactDetails.hidden = true;
	ui.mailingListDetails.hidden = true;
	let selected = this.querySelector(".selected");
	if (selected) {
		selected.classList.remove("selected");
	}

	while (ui.entries.lastChild) {
		ui.entries.lastChild.remove();
	}

	let target = event.target.closest("li");
	if (!target) {
		return;
	}

	if (event.target.classList.contains("delete")) {
		browser.addressBooks.delete(target.dataset.id);
		return;
	}

	target.classList.add("selected");
	let bookId = target.dataset.id;

	ui.entries.dataset.id = bookId;
	for (let list of await browser.mailingLists.list(bookId)) {
		ui.entries.appendChild(lists.makeItem(list));
	}

	for (let contact of await browser.contacts.list(bookId)) {
		ui.entries.appendChild(contacts.makeItem(contact, true));
	}

	ui.entries.hidden = false;
};

ui.entries.onclick = function(event) {
	ui.contactDetails.hidden = true;
	ui.mailingListDetails.hidden = true;
	let selected = this.querySelector(".selected");
	if (selected) {
		selected.classList.remove("selected");
	}

	let target = event.target.closest("li");
	if (!target) {
		return;
	}

	if (event.target.classList.contains("delete")) {
		browser.contacts.delete(target.dataset.id);
		return;
	}

	target.classList.add("selected");

	if (target.classList.contains("contact")) {
		contacts.showDetails(target.dataset.id);
	} else if (target.classList.contains("mailingList")) {
		lists.showDetails(target.dataset.id);
	}
};
ui.entries.ondragstart = function(event) {
	let target = event.target.closest("li");
	if (!target || !target.classList.contains("contact")) {
		return;
	}

	event.dataTransfer.setData("x/dragged", target.dataset.id);
	event.dataTransfer.effectAllowed = "copy";
};
ui.members.ondragenter = ui.members.ondragover = function(event) {
	let id = event.dataTransfer.getData("x/dragged");
	for (let child of ui.members.children) {
		if (child.dataset.id == id) {
			return;
		}
	}
	event.preventDefault();
};
ui.members.ondrop = function(event) {
	let id = event.dataTransfer.getData("x/dragged");
	browser.mailingLists.addMember(ui.mailingListDetails.dataset.id, id);
};
ui.members.onclick = function(event) {
	if (event.target.classList.contains("delete")) {
		let target = event.target.closest("li");
		browser.mailingLists.removeMember(ui.mailingListDetails.dataset.id, target.dataset.id);
	}
};

ui.contactDetails.onsubmit = function() {
	return false;
};
ui.contactDetails.querySelector("button").onclick = async function() {
	let id = ui.contactDetails.dataset.id;
	let properties = {};
	for (let input of ui.contactDetails.querySelectorAll("label input")) {
		properties[input.name] = input.value || null;
	}
	this.disabled = true;
	await browser.contacts.update(id, properties);
	this.disabled = false;
};

ui.mailingListDetails.onsubmit = function() {
	return false;
};
ui.mailingListDetails.querySelector("button").onclick = async function() {
	let id = ui.mailingListDetails.dataset.id;
	this.disabled = true;
	await browser.mailingLists.update(id, {
		name: ui.mailingListDetails.name.value,
		nickName: ui.mailingListDetails.nickName.value,
		description: ui.mailingListDetails.description.value,
	});
	ui.entries.querySelector(`[data-id="${id}"]`).textContent = ui.mailingListDetails.name.value;
	this.disabled = false;
};

var books = {
	async init() {
		for (let book of await browser.addressBooks.list()) {
			ui.addressBooks.appendChild(this.makeItem(book));
		}

		browser.addressBooks.onCreated.addListener(this.onCreated);
		browser.addressBooks.onUpdated.addListener(this.onUpdated);
		browser.addressBooks.onDeleted.addListener(this.onDeleted);
		addEventListener("unload", () => {
			browser.addressBooks.onCreated.removeListener(this.onCreated);
			browser.addressBooks.onUpdated.removeListener(this.onUpdated);
			browser.addressBooks.onDeleted.removeListener(this.onDeleted);
		});
	},
	makeItem(book) {
		let li = ui.itemTemplate.content.firstElementChild.cloneNode(true);
		li.classList.add("addressBook");
		li.dataset.id = book.id;
		li.querySelector("span").textContent = book.name;
		return li;
	},
	onCreated(book) {
		ui.addressBooks.appendChild(books.makeItem(book));
	},
	onUpdated(book) {
		ui.addressBooks.querySelector(`li.addressBook[data-id="${book.id}"]`).textContent = book.name;
	},
	onDeleted(id) {
		ui.addressBooks.querySelector(`li.addressBook[data-id="${id}"]`).remove();
		if (ui.entries.dataset.id == id) {
			ui.entries.hidden = true;
			ui.contactDetails.hidden = true;
			ui.mailingListDetails.hidden = true;
		}
	},
};
books.init();

var contacts = {
	init() {
		browser.contacts.onCreated.addListener(this.onCreated);
		browser.contacts.onUpdated.addListener(this.onUpdated);
		browser.contacts.onDeleted.addListener(this.onDeleted);
		addEventListener("unload", () => {
			browser.contacts.onCreated.removeListener(this.onCreated);
			browser.contacts.onUpdated.removeListener(this.onUpdated);
			browser.contacts.onDeleted.removeListener(this.onDeleted);
		});
	},
	getLabel(contact) {
		if ("DisplayName" in contact.properties && contact.properties.DisplayName) {
			return contact.properties.DisplayName;
		} else if ("FirstName" in contact.properties && contact.properties.FirstName) {
			let label = contact.properties.FirstName;
			if ("LastName" in contact.properties) {
				return label + " " + contact.properties.LastName;
			}
			return label;
		} else {
			return contact.properties.PrimaryEmail;
		}
	},
	makeItem(contact, draggable = false) {
		let li = ui.itemTemplate.content.firstElementChild.cloneNode(true);
		li.classList.add("contact");
		li.dataset.id = contact.id;
		li.querySelector("span").textContent = contacts.getLabel(contact);
		if (draggable) {
			li.setAttribute("draggable", "true");
		}
		return li;
	},
	async showDetails(id) {
		ui.contactDetails.dataset.id = id;

		for (let label of [...ui.contactDetails.querySelectorAll("label")]) {
			label.remove();
		}

		let contact = await browser.contacts.get(id);
		let fields = ["DisplayName", "FirstName", "LastName", "PrimaryEmail"];
		for (let field of Object.keys(contact.properties).sort()) {
			if (!fields.includes(field)) {
				fields.push(field);
			}
		}

		let template = ui.contactDetails.querySelector("template");
		for (let field of fields) {
			let label = template.content.firstElementChild.cloneNode(true);
			label.querySelector("span").textContent = `${field}:`;
			label.querySelector("input").name = field;
			label.querySelector("input").value = contact.properties[field] || "";
			ui.contactDetails.insertBefore(label, ui.contactDetails.lastElementChild);
		}

		ui.contactDetails.hidden = false;
	},
	onCreated(contact) {
		if (ui.entries.dataset.id == contact.parentId) {
			ui.entries.appendChild(contacts.makeItem(contact, true));
		}
	},
	onUpdated(contact) {
		for (let li of document.querySelectorAll(`li.contact[data-id="${contact.id}"]`)) {
			li.textContent = contacts.getLabel(contact);
		}
		if (ui.contactDetails.dataset.id == contact.id) {
			contacts.showDetails(contact.id);
		}
	},
	onDeleted(parentId, id) {
		if (ui.entries.dataset.id == parentId) {
			ui.entries.querySelector(`li.contact[data-id="${id}"]`).remove();
		}
		if (ui.contactDetails.dataset.id == id) {
			ui.contactDetails.hidden = true;
		}
	},
};
contacts.init();

var lists = {
	init() {
		browser.mailingLists.onCreated.addListener(this.onCreated);
		browser.mailingLists.onUpdated.addListener(this.onUpdated);
		browser.mailingLists.onDeleted.addListener(this.onDeleted);
		browser.mailingLists.onMemberAdded.addListener(this.onMemberAdded);
		browser.mailingLists.onMemberRemoved.addListener(this.onMemberRemoved);
		addEventListener("unload", () => {
			browser.mailingLists.onCreated.removeListener(this.onCreated);
			browser.mailingLists.onUpdated.removeListener(this.onUpdated);
			browser.mailingLists.onDeleted.removeListener(this.onDeleted);
			browser.mailingLists.onMemberAdded.removeListener(this.onMemberAdded);
			browser.mailingLists.onMemberRemoved.removeListener(this.onMemberRemoved);
		});
	},
	makeItem(list) {
		let li = document.createElement("li");
		li.dataset.id = list.id;
		li.classList.add("mailingList");
		li.textContent = list.name;
		return li;
	},
	async showDetails(id) {
		ui.mailingListDetails.dataset.id = id;
		let list = await browser.mailingLists.get(id);

		for (let field of ["name", "nickName", "description"]) {
			ui.mailingListDetails[field].value = list[field] || "";
		}

		while (ui.members.lastChild) {
			ui.members.lastChild.remove();
		}

		let members = await browser.mailingLists.listMembers(id);
		for (let member of members) {
			let li = contacts.makeItem(member);
			ui.members.appendChild(li);
		}

		ui.mailingListDetails.hidden = false;
	},
	onCreated(list) {
		if (ui.entries.dataset.id == list.parentId) {
			ui.entries.insertBefore(lists.makeItem(list), ui.entries.querySelector(".contact"));
		}	
	},
	onUpdated(list) {
		let li = ui.entries.querySelector(`li.contact[data-id="${list.id}"]`);
		if (li) {
			li.textContent = list.name;

			if (ui.mailingListDetails.dataset.id == list.id) {
				lists.showDetails(list.id);
			}
		}
	},
	onDeleted(parentId, id) {
		if (ui.entries.dataset.id == parentId) {
			ui.entries.querySelector(`li.mailingList[data-id="${id}"]`).remove();
		}	
		if (ui.mailingListDetails.dataset.id == id) {
			ui.mailingListDetails.hidden = true;
		}
	},
	onMemberAdded(contact) {
		if (ui.mailingListDetails.dataset.id == contact.parentId) {
			ui.members.appendChild(contacts.makeItem(contact));
		}	
	},
	onMemberRemoved(listId, id) {
		if (ui.mailingListDetails.dataset.id == listId) {
			ui.members.querySelector(`li.contact[data-id="${id}"]`).remove();
		}
	},
};
lists.init();

for (let eventNamespace of ["addressBooks", "contacts", "mailingLists"]) {
	for (let eventName of ["onCreated", "onUpdated", "onDeleted", "onMemberAdded", "onMemberRemoved"]) {
		if (eventName in browser[eventNamespace]) {
			browser[eventNamespace][eventName].addListener((...args) => {
				let stringArgs = args.map(JSON.stringify).join(", ");
				let li = document.createElement("li");
				li.textContent = `${eventNamespace}.${eventName}(${stringArgs})`;
				ui.eventlog.appendChild(li);
			});
		}
	}
}
