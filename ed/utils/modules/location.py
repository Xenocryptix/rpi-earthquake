import requests

def get_location(ip_address=None):
    url = (
        f"http://ipinfo.io/{ip_address}/json" if ip_address else "http://ipinfo.io/json"
    )
    response = requests.get(url)
    data = response.json()
    if "loc" in data:
        # Extract latitude and longitude from the 'loc' field
        latitude, longitude = map(float, data["loc"].split(","))
        return latitude, longitude
    else:
        return None, None

def get_coords():
    latitude, longitude = get_location()
    if latitude is not None and longitude is not None:
        return latitude, longitude
    else:
        return None, None

# Example usage
if __name__ == "__main__":
    latitude, longitude = get_coords()
    if latitude is not None and longitude is not None:
        print(f"Latitude: {latitude}")
        print(f"Longitude: {longitude}")
    else:
        print("Unable to fetch location information.")
