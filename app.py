from flask import Flask, request, flash, request, render_template, redirect, jsonify, session
from models import db, connect_db, User, Favorite, Query
from forms import QueryForm, offenses_tuples
from requests_cache import CachedSession
import requests
import json

app = Flask(__name__)
app.config['SECRET_KEY'] = "SECRET_KEY"
app.config["SQLALCHEMY_DATABASE_URI"] = "postgresql:///crime_over_time"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

connect_db(app)

request_cache = CachedSession('cache_1', 'sqlite', 7776000)
api_url = 'https://api.usa.gov/crime/fbi/sapi/'
base_endpoint = 'api/data/nibrs/'
headers = {'x-api-key': 'her0c01v93zfPIBouBZkcuHKyhshiZKsOC7d4VZh'}

@app.route('/')
def show_home():
    form = QueryForm()
    form.offense.data = session['offense'] if session.get('offense') else None
    form.info.data = session['info'] if session.get('info') else None
    form.scope.data = session['scope']  if session.get('scope') else None
    form.location.data = session['location'] if session.get('location') else None
    form.data.data = session['variable'] if session.get('variable') else None
    return render_template('home.html', form=form)

@app.route('/results', methods=['POST'])
def call_api():
    form = QueryForm()

    if form.validate_on_submit():
        session['offense'] = form.offense.data
        session['info'] = form.info.data
        session['scope'] = form.scope.data
        session['location'] = form.location.data
        session['variable'] = form.data.data

        return render_template('results.html', form=form)
    else:
        return redirect('/')

@app.route('/heatmap/<state>')
def generate_count_info(state):

    offense = session['offense']
    info = session['info']
    scope = session['scope']

    request_url = f"{api_url}{base_endpoint}{offense}/{info}/{scope}/{state}/count"
    request = request_cache.get(request_url, headers=headers)

    return jsonify(request.json())
   
@app.route('/chart')
def generate_results_chart():

    offense = session['offense']
    info = session['info']
    scope = session['scope']
    location = session['location']
    variable = session['variable']

    full_request_url = f"{api_url}{base_endpoint}{offense}/{info}/{scope}/{location}/{variable}"
    print(full_request_url)
    request = request_cache.get(full_request_url, headers=headers)
    return jsonify(request.json())


@app.route('/agencies')
def return_offenses():
    """returns a list of agencies to be utilized by the on-page JS"""
    raw_req = session.get(f'{api_url}api/agencies', headers=headers)
    ori_list = []
    agency_list = []
    agency_json = raw_req.json()
    for key in agency_json.keys():
        for ori in agency_json[key]:
            ori_list.append(agency_json[key][ori]['ori'])
            agency_list.append(agency_json[key][ori]['agency_name'])
    agency_options = [(ori_list[n], agency_list[n]) for n in range(len(ori_list))]
    return jsonify(agency_options)
