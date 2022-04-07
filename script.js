console.log(`
:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
::                                                         ::
::          MetaGear Website Bug Fix (UNOFFICIAL)          ::
::                                                         ::
::  GitHub: https://github.com/codegamez/metagear-bug-fix  ::
::                                                         ::
:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
`)

// script states
let localState = {
	loading: false,
	inSearch: false,
	searchFetched: false,
	searchName: "",
	levelFrom: null,
	levelTo: null,
	energyFrom: null,
	energyTo: null,
	listings: [],
}
// website states
let oldState = {}
let state = {}

var react = null

// main loop
const intervalId = setInterval(() => {
	// get react main component
	const targetElement = document.querySelector("#main-content")
	if (!targetElement) return
	react = findReact(targetElement)

	// get website state
	oldState = state
	state = (react && react.state) || state
	if (!state.filters_storage) {
		state.filters_storage = {
			price_orderby: "",
			filter_rangeprice: [],
			filter_rarity: [],
			filter_blueprint: [],
			filter_paymentmethod: [],
			filter_listing_type: [],
			filter_owner: "",
		}
	}

	// doing some changes in the website
	addMachinePartSlots()
	addBSCScanButton()
	addDetailAttributes()
	addSearchFilters()
}, 500)

// showing chassis slots position - START
const imageScale = 0.72
const images = {
	weapon: {
		size: 47 * imageScale,
		link: "https://raw.githubusercontent.com/codegamez/metagear-bug-fix/master/images/weapon.png",
		bottom: 0 * imageScale,
		left: 0 * imageScale,
	},
	gadget: {
		size: 41 * imageScale,
		link: "https://raw.githubusercontent.com/codegamez/metagear-bug-fix/master/images/gadget.png",
		bottom: 0 * imageScale,
		left: 0 * imageScale,
	},
	wheel: {
		size: 68 * imageScale,
		link: "https://raw.githubusercontent.com/codegamez/metagear-bug-fix/master/images/wheel.png",
		bottom: 0 * imageScale,
		left: 0 * imageScale,
	},
}
function getDetail() {
	if (
		state &&
		state.detail &&
		state.detail.item &&
		state.detail.item.gameData
	) {
		return state.detail
	}
	if (
		state &&
		state.bodyModal &&
		state.bodyModal.props &&
		state.bodyModal.props.detail &&
		state.bodyModal.props.detail.item &&
		state.bodyModal.props.detail.item.gameData
	) {
		return state.bodyModal.props.detail
	}
	return null
}
function isDialog() {
	if (
		state &&
		state.detail &&
		state.detail.item &&
		state.detail.item.gameData
	) {
		return false
	}
	if (
		state &&
		state.bodyModal &&
		state.bodyModal.props &&
		state.bodyModal.props.detail &&
		state.bodyModal.props.detail.item &&
		state.bodyModal.props.detail.item.gameData
	) {
		return true
	}
	return false
}
function addMachinePartSlots() {
	const detail = getDetail()
	const ctrElement = document.querySelector(".single-item__image")
	let slotsElement = document.querySelector(".single-item__slots")

	if (!detail || !ctrElement || slotsElement) return

	console.log("addMachinePartSlots")

	const slots = detail.item.gameData.slots || []

	const imageElement = ctrElement.querySelector("img")
	if (!imageElement) return

	const totalWidth = ctrElement.clientWidth
	const totalHeight = ctrElement.clientHeight

	let imageWidth = imageElement.clientWidth
	let imageHeight = imageElement.clientHeight
	let imageSize = Math.max(imageWidth, imageHeight)

	let imageRealWidth = imageElement.naturalWidth
	let imageRealHeight = imageElement.naturalHeight
	let imageRealSize = Math.max(imageRealWidth, imageRealHeight)

	let frameWidth
	let frameHeight

	if (
		slots.filter((s) => {
			const image = images[s.type]
			if (!image) return false
			const t =
				Math.abs((s.position.x * 400 * imageSize) / imageRealSize) -
					image.size / 3 >
					imageWidth ||
				Math.abs((s.position.y * 400 * imageSize) / imageRealSize) -
					image.size / 3 >
					imageHeight
			return t
		}).length > 1
	) {
		frameWidth = (200 * imageSize) / imageRealSize
		frameHeight = (200 * imageSize) / imageRealSize
	} else {
		frameWidth = (400 * imageSize) / imageRealSize
		frameHeight = (400 * imageSize) / imageRealSize
	}

	ctrElement.innerHTML += `
			<div 
				class="single-item__slots"
				style="width: ${frameWidth}px; height: ${frameHeight}px;"
			/>
		`

	slotsElement = document.querySelector(".single-item__slots")

	slots.forEach((slot) => {
		const image = images[slot.type]
		if (!image) return
		const slotLeft =
			-image.size / 2 +
			image.left +
			frameWidth / 2 +
			(frameWidth * slot.position.x) / 2
		const slotBottom =
			-image.size / 2 +
			image.bottom +
			frameHeight / 2 +
			(frameHeight * slot.position.y) / 2
		slotsElement.innerHTML += `
				<img 
					class="single-item__slot"
					style="
						left: ${slotLeft}px; 
						bottom: ${slotBottom}px;
						width: ${image.size}px;
						height: ${image.size}px;
					"
					src="${image.link}"
					alt=""
				/>
			`
	})
}
// showing chassis slots position - END

// adding bsc scan button for NFT history - START
function addBSCScanButton() {
	const detail = getDetail()

	const detailLeftElement = document.querySelector(".single-item__thumbnail")

	if (
		!detailLeftElement ||
		detail.item.contract != "0x3e3aef91d5c253387f57ef537b3b0de20afc455e"
	) {
		return
	}

	const bscscanElement = detailLeftElement.querySelector(
		"#single-item__bscscan"
	)

	if (bscscanElement) return

	console.log("addBSCScanButton")

	const el = document.createElement("a")
	el.id = "single-item__bscscan"
	el.href = `https://bscscan.com/token/0x3e3aef91d5c253387f57ef537b3b0de20afc455e?a=${detail.item.id}`
	el.innerText = "BSC Scan"
	el.classList.add("mb-2", "mt-2")
	el.classList.add("d-inline-block")
	detailLeftElement.appendChild(el)
}
// adding bsc scan button for NFT history - END

// adding detail attributes - START
function getDetailAttributes() {
	const detail = getDetail()
	if (
		detail &&
		detail.item &&
		detail.item.metadata &&
		detail.item.metadata.attributes
	) {
		return detail.item.metadata.attributes
	}
	return null
}
function addDetailAttributes() {
	const attributes = getDetailAttributes()
	const attributesElement = document.querySelector(
		".single-item__attributes .row"
	)
	if (!attributesElement) return
}
// adding detail attributes - END

// adding search items to marketplace filters - START
function addSearchFilters() {
	// search on website filters change

	try {
		if (
			Object.keys(oldState).length &&
			JSON.stringify(oldState) != JSON.stringify(state)
		) {
			localState = {
				...localState,
				searchFetched: false,
			}
			search()
		}
	} catch (e) {}

	const message =
		"select at least one option from the GEAR or RARITY filters."

	const listingGridElement = document.querySelector(".listing-grid")
	const listSearchElement = document.querySelector("#list-search")
	const listingItemsElement = document.querySelector(
		".listing-grid .row:nth-child(1)"
	)
	const paginationElement = document.querySelector(
		".page-main-content > div:nth-child(3)"
	)

	if (
		!state ||
		!listSearchElement ||
		!listingGridElement ||
		!listingItemsElement ||
		!paginationElement
	) {
		return
	}

	let listingItemsSecondElement = document.querySelector(
		".listing-grid .row:nth-child(2)"
	)
	if (!listingItemsSecondElement) {
		console.log("addSearchFilters")
	}
	if (!listingItemsSecondElement) {
		const el = document.createElement("div")
		el.classList.add("row")
		el.innerHTML = ``
		listingGridElement.appendChild(el)
		listingItemsSecondElement = document.querySelector(
			".listing-grid .row:nth-child(2)"
		)
		listingItemsSecondElement.classList.add("hidden")
	}

	let listingLoadingElement = document.querySelector(
		".listing-grid .row:nth-child(3)"
	)
	if (!listingLoadingElement) {
		const el = document.createElement("div")
		el.classList.add("row")
		el.innerHTML = `
			<div class="mh-400 position-relative">
				<div class="pt-4 text-center loading_animate_div" id="animate_div">
					<div class="loading-inner mb-3">
						<div class="progress-wrap">
							<div class="progress-line progress-h-line"></div>
							<div class="progress-line progress-v-line"></div>
							<div class="progress">
								<div
									class="progress-bar"
									role="progressbar"
									id="page-loading-progress-bar"
									aria-valuenow="0"
									aria-valuemin="0"
									aria-valuemax="100"
								></div>
							</div>
						</div>
					</div>
				</div>
			</div>
		`
		listingGridElement.appendChild(el)
		listingLoadingElement = document.querySelector(
			".listing-grid .row:nth-child(3)"
		)
		listingLoadingElement.classList.add("hidden")
	}

	// adding energy filter
	let searchEnergyFromElement = document.querySelector(
		"#cg-search-field-energy-from"
	)
	let searchEnergyToElement = document.querySelector(
		"#cg-search-field-energy-to"
	)
	let searchEnergyMessageElement = document.querySelector(
		"#cg-search-field-energy-message"
	)
	if (!searchEnergyFromElement || !searchEnergyToElement) {
		const el = document.createElement("div")
		el.classList.add("widget")
		el.innerHTML = `
			<p class="widget-title">Energy</p>
			<div class="widget-content">
				<input 
					type="number" 
					name="item-energy-from" 
					id="cg-search-field-energy-from" 
					class="search-field mt-0 mb-3" 
					placeholder="From Energy">
				<input 
					type="number" 
					name="item-energy-to" 
					id="cg-search-field-energy-to" 
					class="search-field mt-0" 
					placeholder="To Energy">
				<span id="cg-search-field-energy-message" class="text-white">${message}</span>
			</div>
		`
		document.querySelector(".widget:nth-child(2)").after(el)
		searchEnergyFromElement = document.querySelector(
			"#cg-search-field-energy-from"
		)
		searchEnergyToElement = document.querySelector(
			"#cg-search-field-energy-to"
		)
		searchEnergyMessageElement = document.querySelector(
			"#cg-search-field-energy-message"
		)
		searchEnergyFromElement.addEventListener("change", (e) => {
			localState = {
				...localState,
				energyFrom: Number(e.target.value) || null,
			}
			search()
		})
		searchEnergyToElement.addEventListener("change", (e) => {
			localState = {
				...localState,
				energyTo: Number(e.target.value) || null,
			}
			search()
		})
	}

	// adding level filter
	let searchLevelFromElement = document.querySelector(
		"#cg-search-field-level-from"
	)
	let searchLevelToElement = document.querySelector(
		"#cg-search-field-level-to"
	)
	let searchLevelMessageElement = document.querySelector(
		"#cg-search-field-level-message"
	)
	if (!searchLevelFromElement || !searchLevelToElement) {
		const el = document.createElement("div")
		el.classList.add("widget")
		el.innerHTML = `
			<p class="widget-title">Level</p>
			<div class="widget-content">
				<input 
					type="number" 
					name="item-level-from" 
					id="cg-search-field-level-from" 
					class="search-field mt-0 mb-3" 
					placeholder="From Level">
				<input 
					type="number" 
					name="item-level-to" 
					id="cg-search-field-level-to" 
					class="search-field mt-0" 
					placeholder="To Level">
				<span id="cg-search-field-level-message" class="text-white">${message}</span>
			</div>
		`
		document.querySelector(".widget:nth-child(2)").after(el)
		searchLevelFromElement = document.querySelector(
			"#cg-search-field-level-from"
		)
		searchLevelToElement = document.querySelector(
			"#cg-search-field-level-to"
		)
		searchLevelMessageElement = document.querySelector(
			"#cg-search-field-level-message"
		)
		searchLevelFromElement.addEventListener("change", (e) => {
			localState = {
				...localState,
				levelFrom: Number(e.target.value) || null,
			}
			search()
		})
		searchLevelToElement.addEventListener("change", (e) => {
			localState = {
				...localState,
				levelTo: Number(e.target.value) || null,
			}
			search()
		})
	}

	// adding genesis filter - added by the metagear team

	// adding name filter
	let searchNameElement = document.querySelector("#cg-search-field-name")
	let searchNameMessageElement = document.querySelector(
		"#cg-search-field-name-message"
	)
	if (!searchNameElement) {
		const el = document.createElement("div")
		el.classList.add("widget")
		el.innerHTML = `
			<p class="widget-title">Item Name</p>
			<div class="widget-content">
				<input 
					type="text" 
					name="item-name" 
					id="cg-search-field-name" 
					class="search-field mt-0" 
					placeholder="Search by Name">
				<span id="cg-search-field-name-message" class="text-white">${message}</span>
			</div>
		`
		document.querySelector(".widget:nth-child(2)").after(el)
		searchNameElement = document.querySelector("#cg-search-field-name")
		searchNameMessageElement = document.querySelector(
			"#cg-search-field-name-message"
		)
		searchNameElement.addEventListener("change", (e) => {
			localState = {
				...localState,
				searchName: e.target.value || "",
			}
			search()
		})
	}

	if (
		!localState.loading &&
		!localState.searchName &&
		!localState.levelFrom &&
		!localState.levelTo &&
		!localState.energyFrom &&
		!localState.energyTo &&
		localState.inSearch
	) {
		localState = {
			...localState,
			inSearch: false,
		}
	}

	if (localState.inSearch) {
		listingItemsElement.classList.add("hidden")
		paginationElement.classList.add("hidden")
		if (localState.loading) {
			listingLoadingElement.classList.remove("hidden")
			listingItemsSecondElement.classList.add("hidden")
		} else {
			listingLoadingElement.classList.add("hidden")
			listingItemsSecondElement.classList.remove("hidden")
		}
	} else {
		listingLoadingElement.classList.add("hidden")
		listingItemsElement.classList.remove("hidden")
		listingItemsSecondElement.classList.add("hidden")
		paginationElement.classList.remove("hidden")
	}

	if (
		!state.filters_storage.filter_rarity.length &&
		!state.filters_storage.filter_blueprint.length
	) {
		searchNameElement.classList.add("d-none")
		searchNameMessageElement.classList.remove("d-none")

		searchLevelFromElement.classList.add("d-none")
		searchLevelToElement.classList.add("d-none")
		searchLevelMessageElement.classList.remove("d-none")

		searchEnergyFromElement.classList.add("d-none")
		searchEnergyToElement.classList.add("d-none")
		searchEnergyMessageElement.classList.remove("d-none")
	} else {
		searchNameElement.classList.remove("d-none")
		searchNameMessageElement.classList.add("d-none")

		searchLevelFromElement.classList.remove("d-none")
		searchLevelToElement.classList.remove("d-none")
		searchLevelMessageElement.classList.add("d-none")

		searchEnergyFromElement.classList.remove("d-none")
		searchEnergyToElement.classList.remove("d-none")
		searchEnergyMessageElement.classList.add("d-none")
	}
}
async function search() {
	if (localState.loading) return

	const hasFilter =
		localState.searchName ||
		localState.levelFrom ||
		localState.levelTo ||
		localState.energyFrom ||
		localState.energyTo
	const isFilterEnable =
		state.filters_storage.filter_rarity.length ||
		state.filters_storage.filter_blueprint.length

	if (!isFilterEnable || !hasFilter) {
		localState = {
			...localState,
			loading: false,
			inSearch: false,
		}
		return
	}

	if (localState.searchFetched) {
		updateItemsSencondList()
		localState = {
			...localState,
			loading: false,
			inSearch: true,
		}
		console.log("search from cache")
		return
	} else {
		console.log("search from server")
	}

	localState = {
		...localState,
		loading: true,
		inSearch: true,
	}

	const [orderBy, orderDirection] = state.filters_storage.price_orderby.split(
		"-"
	) || ["", ""]

	try {
		let listings = []
		let maxPage = 1
		for (let page = 1; page <= maxPage; page++) {
			const r = await fetch(
				"https://api.metagear.game/api/v1/public/listings",
				{
					method: "post",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({
						page: page,
						size: 100,
						orderBy: orderBy || "createdTime",
						orderDirection: orderDirection || "desc",
						filters: [
							state.filters_storage.filter_paymentmethod
								.length && {
								type: "paymentMethod",
								value:
									state.filters_storage
										.filter_paymentmethod || [],
							},
							state.filters_storage.filter_rarity.length && {
								type: "quality",
								value:
									state.filters_storage.filter_rarity || [],
							},
							state.filters_storage.filter_listing_type
								.length && {
								type: "listingType",
								value:
									state.filters_storage.filter_listing_type ||
									[],
							},
							state.filters_storage.filter_blueprint.length && {
								type: "type",
								value:
									state.filters_storage.filter_blueprint ||
									[],
							},
							{ type: "status", value: ["1"] },
						].filter((v) => v),
					}),
				}
			)
			const data = await r.json()
			maxPage = data.data.totalPage
			listings = [...listings, ...data.data.listings]
		}
		localState = {
			...localState,
			searchFetched: true,
			listings: listings,
		}
		updateItemsSencondList()
	} catch (e) {
		console.log(e)
	}

	localState = {
		...localState,
		loading: false,
		inSearch: true,
	}
}
function updateItemsSencondList() {
	items = localState.listings
		.filter((v) =>
			v.item.metadata.name
				.toLowerCase()
				.includes((localState.searchName || "").toLowerCase())
		)
		.filter((v) => {
			const level = v.item.metadata.attributes.find(
				(t) => t.trait_type == "level"
			)
			if (!level) return true
			return (
				(!localState.levelFrom ||
					localState.levelFrom <= level.value) &&
				(!localState.levelTo || level.value <= localState.levelTo)
			)
		})
		.filter((v) => {
			const energy = v.item.metadata.attributes.find(
				(t) => t.trait_type == "energy"
			)
			if (!energy) return true
			return (
				(!localState.energyFrom ||
					localState.energyFrom <= energy.value) &&
				(!localState.energyTo || energy.value <= localState.energyTo)
			)
		})
	let listingItemsSecondElement = document.querySelector(
		".listing-grid .row:nth-child(2)"
	)
	if (!listingItemsSecondElement) return

	const quality_badges = {
		Common: "gear-badge-c",
		Rare: "gear-badge-r",
		Mythical: "gear-badge-m",
		Legendary: "gear-badge-l",
	}

	const content = items
		.map((item) => {
			let quality =
				item.item.metadata.attributes.find(
					(v) => v.trait_type == "quality"
				) || null
			if (quality) quality = quality.value || ""

			let is_forever =
				item.item.metadata.attributes.find(
					(v) => v.trait_type == "is_forever"
				) || null
			if (is_forever) is_forever = +is_forever.value

			let quantity = +item.quantity || 1

			let minPrice = item.minPrice
			minPrice =
				minPrice.substring(0, minPrice.length - 18) +
				"." +
				minPrice.substring(minPrice.length - 18)
			minPrice = +minPrice

			let price = item.price
			price =
				price.substring(0, price.length - 18) +
				"." +
				price.substring(price.length - 18)
			price = +price

			let seller = item.seller
			seller = seller.substr(0, 7) + "..." + seller.substr(30, 12)

			let duration = (+item.rentPeriod || 0) / 86400
			let durationSign = duration > 1 ? "days" : "day"

			let type =
				item.item.metadata.attributes.find(
					(v) => v.trait_type == "type"
				) || null
			if (type) type = type.value

			let level =
				item.item.metadata.attributes.find(
					(v) => v.trait_type == "level"
				) || null
			if (level) level = +level.value

			const isFixed = item.listingType == "buy_now"
			const isAction = item.listingType == "auction"
			const isRent = item.listingType == "rent"

			return `
				<div class="
						listing-type-${item.listingType} 
						gear-type-${type}
						gear-item-wrap col-xl-4 col-md-6
					">
					<a class="gear-item gear-group-gameitem" 
							href="/marketplace/${item.id}">
						<div class="gear-item-content has_quality">
							<div class="gear-item-header">
								<div class="gear-type"></div>
								<h3 class="gear-name box-type-chassis">
									${item.item.metadata.name}
								</h3>
							</div>
							<div class="gear-item-details">
								<div class="quantity quantity_ab ${quantity > 1 ? "" : "d-none"}">
									<strong class="text-white">${quantity}</strong>
								</div>
								<div class="gear-badges ${quality ? "" : "d-none"}">
									<div class="gear-badge ${quality_badges[quality] || ""}">
										<span class="badge-inner">
											${quality}
										</span>
									</div>
								</div>
								<div class="gear-badges gear-badge-level ${level ? "" : "d-none"}">
									<div class="gear-badge">
										<span class="badge-inner">
											${level}
										</span>
									</div>
								</div>
								<div class="genesis-badge ${is_forever ? "" : "d-none"}"></div>
								<div class="gear-thumbnail">
									<img src="${item.item.metadata.image}" class="">
								</div>
								<div class="gear-author">Owner: ${seller}</div>
								<div class="button-wrap ${isFixed ? "" : "d-none"}">
									<div class="button button-red button-hover-green">
										<div class="button-text button-gear">${price} ${item.paymentSymbol}</div>
									</div>
								</div>
								<div class="third-font auction-list-wrap ${isAction ? "" : "d-none"}">
									<div class="d-flex justify-content-center">
										<span class="auction-label">Auction</span>
									</div>
									<div class="d-flex justify-content-between w-100 align-items-center">
										<div class="auction-label-text">START</div>
											<div>
												<strong class="text-blue fs-6 start-price">
													${minPrice} ${item.paymentSymbol}
												</strong>
											</div>
										</div>
										<div class="d-flex justify-content-between w-100 align-items-center">
											<div class="auction-label-text">BUY NOW</div>
										<div>
											<strong class="text-blue fs-5 buy-now-price">
												${price} ${item.paymentSymbol}
											</strong>
										</div>
									</div>
								</div>
								<div class="third-font auction-list-wrap rent-list-wrap ${
									isRent ? "" : "d-none"
								}">
									<div class="d-flex justify-content-center">
										<span class="auction-label rent-label">
											For Rent
										</span>
									</div>
									<div class="d-flex justify-content-between w-100 align-items-center">
										<div class="rent-label-text">
											PRICE
										</div>
										<div>
											<strong class="text-blue fs-6 start-price">
												${price} ${item.paymentSymbol}
											</strong>
										</div>
									</div>
									<div class="d-flex justify-content-between w-100 align-items-center">
										<div class="rent-label-text">
											DURATION
										</div>
										<div>
											<strong class="text-blue fs-5 buy-now-price">
												${duration} ${durationSign}
											</strong>
										</div>
									</div>
								</div>
							</div>
						</div>
					</a>
				</div>
			`
		})
		.join("\n")

	listingItemsSecondElement.innerHTML = content
}
// adding search items to marketplace filters - END

// utils - START
const findReact = (dom, traverseUp = 0) => {
	const key = Object.keys(dom).find((key) => {
		return key.startsWith("__reactFiber$")
	})
	const domFiber = dom[key]
	if (domFiber == null) return null
	const GetCompFiber = (fiber) => {
		let parentFiber = fiber.return
		while (typeof parentFiber.type == "string") {
			parentFiber = parentFiber.return
		}
		return parentFiber
	}
	let compFiber = GetCompFiber(domFiber)
	for (let i = 0; i < traverseUp; i++) {
		compFiber = GetCompFiber(compFiber)
	}
	return compFiber.stateNode
}

function thousandFormat(value) {
	if (!value) return ""
	let v = (value || "") + ""
	let m = false
	if (v.includes("-")) {
		v = v.replace("-", "")
		m = true
	}
	let afterDot = ""
	if (v.indexOf(".") >= 0) {
		afterDot = v.substring(v.indexOf("."), v.length)
		v = v.substring(0, v.indexOf("."))
	}
	v = v
		.replace(/,/g, "")
		.split("")
		.reverse()
		.join("")
		.replace(/(...)/g, "$1,")
		.split("")
		.reverse()
		.join("")
		.replace(/^,+|,+$/, "")
	if (m) v = "-" + v
	v = v + afterDot
	return v
}
// utils - END
